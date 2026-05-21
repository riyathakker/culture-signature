import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const pageVal = searchParams.get("page");
  const limitVal = searchParams.get("limit");

  try {
    const where = {
      AND: [
        query ? {
          OR: [
            { id: { contains: query, mode: "insensitive" as const } },
            { user: { name: { contains: query, mode: "insensitive" as const } } },
            { user: { email: { contains: query, mode: "insensitive" as const } } },
          ],
        } : {},
        status ? { status: status as any } : {},
      ],
    };

    const include = {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    };

    const orderBy = {
      createdAt: "desc" as const,
    };

    if (pageVal && limitVal) {
      const page = parseInt(pageVal);
      const limit = parseInt(limitVal);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.order.count({
          where,
        }),
      ]);

      return NextResponse.json({ items, total });
    }

    const orders = await prisma.order.findMany({
      where,
      include,
      orderBy,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
