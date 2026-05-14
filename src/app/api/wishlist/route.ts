import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ items: [] });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  const items = user?.wishlist.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    images: item.product.images,
    category: item.product.category.name,
    rating: 5, // Default rating if not available
    description: item.product.description || ""
  })) || [];

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const wishlistItem = await prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    },
    update: {},
    create: {
      userId: user.id,
      productId: productId
    }
  });

  return NextResponse.json(wishlistItem);
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

  await prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId: user.id,
        productId: productId
      }
    }
  });

  return NextResponse.json({ success: true });
}
