import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const isNew = searchParams.get("isNew") === "true";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(isNew && {
          createdAt: {
            gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // Last 10 days
          }
        }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
