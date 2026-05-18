import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
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
