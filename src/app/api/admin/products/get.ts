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
  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "";
  const pageVal = searchParams.get("page");
  const limitVal = searchParams.get("limit");

  try {
    const where = {
      AND: [
        query ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
          ],
        } : {},
        categoryId ? { categoryId } : {},
        status === "OUT_OF_STOCK" ? { stock: 0 } : {},
        status === "LOW_STOCK" ? { stock: { lt: 5, gt: 0 } } : {},
      ],
    };

    const include = {
      category: true,
    };

    const orderBy = {
      createdAt: "desc" as const,
    };

    if (pageVal && limitVal) {
      const page = parseInt(pageVal);
      const limit = parseInt(limitVal);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.product.count({
          where,
        }),
      ]);

      return NextResponse.json({ items, total });
    }

    const products = await prisma.product.findMany({
      where,
      include,
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
