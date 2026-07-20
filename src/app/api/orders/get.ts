import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userId?: string }) {
  const userId = req.userId;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Attach the user's reviews so the UI can show given stars/comments per item.
    const reviews = await prisma.review.findMany({
      where: { userId, isDeleted: false },
      select: { productId: true, orderId: true, rating: true, comment: true },
    });

    const withReviews = orders.map((o) => {
      const productIds = o.items.map((it) => it.productId);
      return {
        ...o,
        reviews: reviews.filter(
          (r) => r.orderId === o.id || (!r.orderId && productIds.includes(r.productId))
        ),
      };
    });

    return NextResponse.json(withReviews);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
