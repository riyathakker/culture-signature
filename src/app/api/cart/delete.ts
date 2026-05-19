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
