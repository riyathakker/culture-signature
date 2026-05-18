import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [
      totalRevenue,
      activeOrdersCount,
      totalCustomers,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "CANCELLED" } }
      }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "SHIPPED"] } }
      }),
      prisma.user.count({
        where: { role: "USER", isDeleted: false }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true }
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        take: 3,
        orderBy: { stock: "asc" }
      })
    ]);

    return NextResponse.json({
      revenue: totalRevenue._sum.totalPrice || 0,
      activeOrders: activeOrdersCount,
      customers: totalCustomers,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    console.error("[OVERVIEW_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
