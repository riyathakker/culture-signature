import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }, context: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title: name, description, price, discount, stock, categoryId, images, isFeatured, isLimitedDrop } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categoryId,
        images,
        isFeatured,
        ...(isLimitedDrop !== undefined && { isLimitedDrop }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
