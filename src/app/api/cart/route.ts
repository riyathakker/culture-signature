import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cart: {
        include: {
          product: true
        }
      }
    }
  });

  const items = user?.cart.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price - (item.product.discount || 0),
    quantity: item.quantity,
    image: item.product.images?.[0] || "",
    stock: item.product.stock,
  })) || [];

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
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
  } catch (error) {
    console.error("[CART_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
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
  } catch (error) {
    console.error("[CART_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (productId) {
    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    });
  } else {
    // Clear all
    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    });
  }

  return NextResponse.json({ success: true });
}
