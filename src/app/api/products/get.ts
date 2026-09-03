import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get("categoryId");
  const categoryIds = categoryParam ? categoryParam.split(",") : [];
  const isNew = searchParams.get("isNew") === "true";
  const isFeatured = searchParams.get("isFeatured") === "true";
  const search = searchParams.get("search")?.trim() || "";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {}),
        ...(isFeatured && { isFeatured: true }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }),
      },
      include: {
        category: true,
      },
      // New Arrivals = the newest products (results are already newest-first),
      // so the section is always populated rather than gated to a fixed window.
      orderBy: {
        createdAt: "desc",
      },
      take: limit ?? (isNew ? 12 : undefined),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
