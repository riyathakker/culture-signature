import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userId?: string }) {
  const userId = req.userId;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
