import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import { PaymentService } from "@/services/payment.service";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import {
  resolveOrderLines,
  isDiscountUsable,
  computeOrderTotals,
  AMOUNT_TOLERANCE,
  type RequestedItem,
} from "@/lib/orderPricing";

export default async function handler(req: NextRequest & { userId?: string; userEmail?: string }) {
  const userId = req.userId ?? null;
  const userEmail = req.userEmail ?? null;

  const ip = getClientIp(req);
  const { allowed } = rateLimit(`orders:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many order attempts. Please try again later." }, { status: 429 });
  }

  try {
    const { items, promoCode, shippingAddress, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Payment verification required" }, { status: 400 });
    }

    // Server-side truth: verify the Razorpay signature and confirm the payment
    // was captured — never trust a client-asserted paymentId/status. Any
    // failure here (bad signature, uncaptured payment, forged ids, API error)
    // is treated the same: reject.
    let verification: Awaited<ReturnType<typeof PaymentService.verifyPayment>>;
    try {
      verification = await PaymentService.verifyPayment({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
    } catch (verifyError) {
      console.error("[ORDERS_POST] verifyPayment failed", verifyError);
      return NextResponse.json({ error: "Payment could not be verified" }, { status: 402 });
    }
    if (!verification.success) {
      return NextResponse.json({ error: "Payment could not be verified" }, { status: 402 });
    }

    // Reject if this payment has already been used to create an order.
    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ paymentId: razorpay_payment_id }, { paymentOrderId: razorpay_order_id }] },
    });
    if (existingOrder) {
      return NextResponse.json({ error: "This payment has already been recorded" }, { status: 409 });
    }

    const requestedItems = items as RequestedItem[];
    const products = await prisma.product.findMany({
      where: { id: { in: requestedItems.map((i) => i.id) }, isDeleted: false },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const resolved = resolveOrderLines(requestedItems, productMap);
    if (!resolved.lines) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }
    const lines = resolved.lines;

    let discount = promoCode
      ? await prisma.discount.findFirst({ where: { code: promoCode, isDeleted: false } })
      : null;
    const discountUsable = discount && isDiscountUsable(discount) ? discount : null;

    const totals = computeOrderTotals(lines, discountUsable);

    // Cross-check what was actually charged via Razorpay against the
    // server-recomputed total — catches any tampering upstream of this call.
    if (
      typeof verification.amountPaid !== "number" ||
      Math.abs(verification.amountPaid - totals.total) > AMOUNT_TOLERANCE
    ) {
      console.error("[ORDERS_POST] amount mismatch", { razorpay_order_id, amountPaid: verification.amountPaid, expected: totals.total });
      return NextResponse.json({ error: "Payment amount does not match order total" }, { status: 409 });
    }

    // Precompute stock mutations OUTSIDE the transaction (using the products
    // already fetched above) so the transaction only issues writes — no reads.
    // This keeps the interactive transaction well under its time budget.
    const stockOps = lines.map((line) => {
      if (line.color) {
        const p = productMap.get(line.productId);
        const colors = Array.isArray(p?.colors) ? [...(p!.colors as any[])] : [];
        const ci = colors.findIndex((c: any) => c?.name === line.color);
        if (ci >= 0 && colors[ci]?.stock != null) {
          colors[ci] = { ...colors[ci], stock: Math.max(0, Number(colors[ci].stock) - line.quantity) };
          return { productId: line.productId, data: { colors } };
        }
      }
      return { productId: line.productId, data: { stock: { decrement: line.quantity } } };
    });

    const newOrderId = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice: totals.total,
          discountAmount: totals.discountAmount,
          promoCode: discountUsable ? promoCode : null,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone,
          status: "PAID",
          paymentId: verification.paymentId,
          paymentOrderId: razorpay_order_id,
        },
      });

      await tx.orderItem.createMany({
        data: lines.map((line) => ({
          orderId: newOrder.id,
          productId: line.productId,
          quantity: line.quantity,
          price: line.unitPrice,
          color: line.color || null,
        })),
      });

      if (discountUsable) {
        const newUsedCount = discountUsable.usedCount + 1;
        const nowLimitReached = discountUsable.usageLimit && newUsedCount >= discountUsable.usageLimit;
        await tx.discount.update({
          where: { id: discountUsable.id },
          data: {
            usedCount: newUsedCount,
            status: nowLimitReached ? "EXPIRED" : "ACTIVE",
          },
        });
      }

      if (userId) {
        await tx.cartItem.deleteMany({ where: { userId } });
      }

      for (const op of stockOps) {
        await tx.product.update({ where: { id: op.productId }, data: op.data });
      }

      return newOrder.id;
    }, { timeout: 20000 });

    // Read the full order back after the transaction commits — heavy includes
    // don't belong inside the write transaction.
    const order = await prisma.order.findUnique({
      where: { id: newOrderId },
      include: { items: { include: { product: true } } },
    });

    // Fire order-confirmation emails to the customer + admin (best-effort).
    if (order) {
      await sendOrderConfirmation(order, userEmail);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[ORDERS_POST]", error?.message || error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
