import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating: parseInt(rating),
        comment,
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId, isDeleted: false },
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
