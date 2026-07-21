import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userId?: string }) {
  const userId = req.userId ?? null;

  try {
    const { items, totalPrice, discountAmount, promoCode, shippingAddress, paymentId, cf_order_id } = await req.json();

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          discountAmount: discountAmount || 0,
          promoCode: promoCode || null,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone,
          status: paymentId ? "PAID" : "PENDING",
          paymentId: paymentId || null,
          cfOrderId: cf_order_id || null,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: newOrder.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
        })),
      });

      if (promoCode) {
        const discount = await tx.discount.findFirst({
          where: { code: promoCode, isDeleted: false, status: "ACTIVE" },
        });
        if (discount) {
          const isExpired = discount.expiryDate && new Date(discount.expiryDate) < new Date();
          const isLimitReached = discount.usageLimit && discount.usedCount >= discount.usageLimit;

          if (!isExpired && !isLimitReached) {
            const newUsedCount = discount.usedCount + 1;
            const nowLimitReached = discount.usageLimit && newUsedCount >= discount.usageLimit;

            await tx.discount.update({
              where: { id: discount.id },
              data: {
                usedCount: newUsedCount,
                status: nowLimitReached ? "EXPIRED" : "ACTIVE"
              }
            });
          } else {
            await tx.discount.update({ where: { id: discount.id }, data: { status: "EXPIRED" } });
          }
        }
      }

      // 3. Clear the user's cart
      if (userId) {
        await tx.cartItem.deleteMany({
          where: { userId }
        });
      }

      // 4. Update product stock (shared across colors).
      for (const item of items) {
        if (item.color) {
          const p = await tx.product.findUnique({ where: { id: item.id } });
          const colors = Array.isArray(p?.colors) ? [...(p!.colors as any[])] : [];
          const ci = colors.findIndex((c: any) => c?.name === item.color);
          if (ci >= 0 && colors[ci]?.stock != null) {
            colors[ci] = {
              ...colors[ci],
              stock: Math.max(0, Number(colors[ci].stock) - item.quantity),
            };
            await tx.product.update({ where: { id: item.id }, data: { colors } });
            continue;
          }
        }
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 6. Return order with items
      return tx.order.findUnique({
        where: { id: newOrder.id },
        include: { items: { include: { product: true } } },
      });
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[ORDERS_POST]", error?.message || error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
