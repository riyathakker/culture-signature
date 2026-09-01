import { NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { resolveOrderLines, isDiscountUsable, computeOrderTotals, type RequestedItem } from "@/lib/orderPricing";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { items, promoCode, customerName, customerEmail, customerPhone } = await req.json();

    if (!customerPhone || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
    }

    const requestedItems = items as RequestedItem[];
    if (!requestedItems?.length) {
      return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: requestedItems.map((i) => i.id) }, isDeleted: false },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const resolved = resolveOrderLines(requestedItems, productMap);
    if (!resolved.lines) {
      return NextResponse.json({ error: resolved.error }, { status: 400 });
    }

    let discount = null;
    if (promoCode) {
      const found = await prisma.discount.findFirst({ where: { code: promoCode, isDeleted: false } });
      if (found && isDiscountUsable(found)) discount = found;
    }

    const { total } = computeOrderTotals(resolved.lines, discount);
    if (total <= 0) {
      return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
    }

    const order = await PaymentService.createOrder(total, {
      id: (session?.user as any)?.id,
      name: customerName,
      email: customerEmail || session?.user?.email,
      phone: customerPhone,
    });

    return NextResponse.json({
      payment_session_id: order.payment_session_id,
      cf_order_id: order.order_id,
    });
  } catch (error: any) {
    console.error("[CASHFREE_ORDER]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
