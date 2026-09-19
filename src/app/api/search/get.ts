import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10) || 6, 48);

    if (!q) {
      return NextResponse.json({ products: [], categories: [], total: 0 });
    }

    const [products, categories, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isDeleted: false,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.category.findMany({
        where: {
          isDeleted: false,
          status: "ACTIVE",
          name: { contains: q, mode: "insensitive" },
        },
        take: 5,
      }),
      prisma.product.count({
        where: {
          isDeleted: false,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
      }),
    ]);

    return NextResponse.json({ products, categories, total });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
