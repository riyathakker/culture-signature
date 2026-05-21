import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

function trendPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      activeOrdersCount,
      thisMonthOrders,
      lastMonthOrders,
      totalCustomers,
      thisMonthCustomers,
      lastMonthCustomers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "CANCELLED" }, createdAt: { gte: startOfThisMonth } },
      }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          status: { not: "CANCELLED" },
          createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
      }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "SHIPPED"] } },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      }),
      prisma.user.count({ where: { role: "USER", isDeleted: false } }),
      prisma.user.count({
        where: { role: "USER", isDeleted: false, createdAt: { gte: startOfThisMonth } },
      }),
      prisma.user.count({
        where: {
          role: "USER",
          isDeleted: false,
          createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        take: 3,
        orderBy: { stock: "asc" },
      }),
    ]);

    return NextResponse.json({
      revenue: totalRevenue._sum.totalPrice || 0,
      revenueTrend: trendPercent(
        thisMonthRevenue._sum.totalPrice || 0,
        lastMonthRevenue._sum.totalPrice || 0
      ),
      activeOrders: activeOrdersCount,
      ordersTrend: trendPercent(thisMonthOrders, lastMonthOrders),
      customers: totalCustomers,
      customersTrend: trendPercent(thisMonthCustomers, lastMonthCustomers),
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("[OVERVIEW_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
