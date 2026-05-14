import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session as any)?.user?.id ?? null;
  try {
    const body = await req.json();
    const {
      items,
      totalPrice,
      discountAmount,
      promoCode,
      shippingAddress
    } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: "Missing order information" }, { status: 400 });
    }

    // Start a transaction to create order, items and clear cart
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          discountAmount: discountAmount || 0,
          promoCode,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone,
          status: "PENDING",
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Increment usedCount if promoCode was used
      if (promoCode) {
        const discount = await tx.discount.findFirst({
          where: { code: promoCode, isDeleted: false, status: "ACTIVE" }
        });

        if (discount) {
          const newUsedCount = discount.usedCount + 1;
          const shouldExpire = discount.usageLimit && newUsedCount >= discount.usageLimit;

          await tx.discount.update({
            where: { id: discount.id },
            data: {
              usedCount: newUsedCount,
              status: shouldExpire ? "EXPIRED" : "ACTIVE"
            }
          });
        }
      }

      // 3. Clear the user's cart
      if (userId) {
        await tx.cartItem.deleteMany({
          where: { userId }
        });
      }

      // 4. Update Product Stocks
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }


      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
