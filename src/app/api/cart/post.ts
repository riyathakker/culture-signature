import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { resolveVariant } from "@/lib/colorVariant";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity, color } = await req.json();
  const selectedColor = color || "";

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { stock } = resolveVariant(product as any, selectedColor);

  const existingCartItem = await prisma.cartItem.findUnique({
    where: { userId_productId_color: { userId: user.id, productId, color: selectedColor } }
  });

  const newQuantity = (existingCartItem?.quantity || 0) + (quantity || 1);

  if (newQuantity > stock) {
    return NextResponse.json({
      error: `Only ${stock} items available in stock.`,
      currentStock: stock
    }, { status: 400 });
  }

  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_productId_color: {
        userId: user.id,
        productId: productId,
        color: selectedColor
      }
    },
    update: {
      quantity: newQuantity
    },
    create: {
      userId: user.id,
      productId: productId,
      color: selectedColor,
      quantity: quantity || 1
    }
  });

  return NextResponse.json(cartItem);
}
