import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title: name, description, price, discount, stock, categoryId, images, isFeatured } = body;

    if (!name || !price || !stock || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discount: discount !== undefined ? parseFloat(discount) : 0,
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
