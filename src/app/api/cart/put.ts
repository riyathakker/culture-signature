import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check product stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (quantity > product.stock) {
    return NextResponse.json({ 
      error: `Only ${product.stock} items available in stock.`,
      currentStock: product.stock 
    }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    },
    data: {
      quantity
    }
  });

  return NextResponse.json(cartItem);
}
