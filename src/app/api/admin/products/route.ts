import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          query ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          } : {},
          categoryId ? { categoryId } : {},
          status === "OUT_OF_STOCK" ? { stock: 0 } : {},
          status === "LOW_STOCK" ? { stock: { lt: 5, gt: 0 } } : {},
        ],
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title: name, description, price, stock, categoryId, images, isFeatured } = body;

    if (!name || !price || !stock || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId,
        images: images || [],
        isFeatured: isFeatured || false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
