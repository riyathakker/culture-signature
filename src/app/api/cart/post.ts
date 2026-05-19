import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Uynauthorized" }, { status: 401 });
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

  const existingCartItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } }
  });

  const newQuantity = (existingCartItem?.quantity || 0) + (quantity || 1);

  if (newQuantity > product.stock) {
    return NextResponse.json({ 
      error: `Only ${product.stock} items available in stock.`,
      currentStock: product.stock 
    }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    },
    update: {
      quantity: newQuantity
    },
    create: {
      userId: user.id,
      productId: productId,
      quantity: quantity || 1
    }
  });

  return NextResponse.json(cartItem);
}
