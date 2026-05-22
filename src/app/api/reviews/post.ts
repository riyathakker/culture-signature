import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, rating, comment, orderId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        orderId: orderId || null,
        rating: parseFloat(rating),
        comment,
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
