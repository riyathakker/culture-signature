import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: { orderBy: { createdAt: "desc" }, take: 1 },
        wishlist: { select: { id: true } },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      orderCount: await prisma.order.count({ where: { userId: user.id } }),
      wishlistCount: user.wishlist.length,
      latestOrder: user.orders[0] ?? null,
    });
  } catch (error) {
    console.error("[ACCOUNT_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
