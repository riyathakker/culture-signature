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

  if (stock <= 0) {
    return NextResponse.json({
      error: "This item is out of stock.",
      currentStock: 0
    }, { status: 400 });
  }

  const existingCartItem = await prisma.cartItem.findUnique({
    where: { userId_productId_color: { userId: user.id, productId, color: selectedColor } }
  });

  // Cap the resulting quantity to available stock instead of rejecting, so the
  // cart can never exceed stock — e.g. a stale guest cart (saved with an older,
  // higher stock figure) replayed on login is clamped rather than dropped.
  const desiredQuantity = (existingCartItem?.quantity || 0) + (quantity || 1);
  const newQuantity = Math.min(desiredQuantity, stock);

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
      quantity: newQuantity
    }
  });

  return NextResponse.json(cartItem);
}
