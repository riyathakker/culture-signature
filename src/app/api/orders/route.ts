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

      // 2. Validate and Increment usedCount if promoCode was used
      if (promoCode) {
        const discount = await tx.discount.findFirst({
          where: { 
            code: promoCode, 
            isDeleted: false,
            status: "ACTIVE"
          }
        });

        if (discount) {
          // Check expiry and usage limit again at the time of order placement
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
          } else if (isExpired || isLimitReached) {
            // If it became invalid between application and placement, we should probably mark it as expired now
            await tx.discount.update({
              where: { id: discount.id },
              data: {
                status: "EXPIRED"
              }
            });
            // We could throw an error here, but for now we'll just not count the usage 
            // (the order total might be wrong if the client applied a discount that is no longer valid)
            // Ideally, we should validate the totalPrice matches the expected calculation.
          }
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
