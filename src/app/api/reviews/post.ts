import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, rating, comment, orderId } = await req.json();

  if (!productId) return NextResponse.json({ error: "Product is required" }, { status: 400 });

  const numericRating = parseFloat(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Only verified buyers may review: the reviewer must own a non-cancelled
  // order that contains this product. If an orderId is supplied, it must be
  // that user's order and contain the product; otherwise fall back to any
  // qualifying order. This prevents spoofed reviews via forged orderIds.
  const purchase = await prisma.order.findFirst({
    where: {
      userId: user.id,
      isDeleted: false,
      status: { not: "CANCELLED" },
      ...(orderId ? { id: orderId } : {}),
      items: { some: { productId } },
    },
    select: { id: true },
  });

  if (!purchase) {
    return NextResponse.json(
      { error: "You can only review products you have purchased." },
      { status: 403 }
    );
  }

  const existing = await prisma.review.findFirst({ where: { userId: user.id, productId } });
  if (existing) return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });

  try {
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        orderId: purchase.id,
        rating: numericRating,
        comment,
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
