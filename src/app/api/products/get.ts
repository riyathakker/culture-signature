import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get("categoryId");
  const categoryIds = categoryParam ? categoryParam.split(",").filter(Boolean) : [];
  const isNew = searchParams.get("isNew") === "true";
  const isFeatured = searchParams.get("isFeatured") === "true";
  const search = searchParams.get("search")?.trim() || "";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  // Pagination is opt-in: only when `page` is present. Callers that don't pass
  // it (featured, new-arrivals, per-category pages) keep getting a plain array.
  const pageParam = searchParams.get("page");
  const isPaginated = pageParam !== null;

  // Build the shared filter clause.
  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
    ...(categoryIds.length > 0 ? { categoryId: { in: categoryIds } } : {}),
    ...(isFeatured && { isFeatured: true }),
    ...(isNew && { isFeatured: false }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { name: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  try {
    if (!isPaginated) {
      const products = await prisma.product.findMany({
        where,
        include: { category: true },
        // New Arrivals = the newest products (results are already newest-first),
        // so the section is always populated rather than gated to a fixed window.
        orderBy: { createdAt: "desc" },
        take: limit ?? (isNew ? 12 : undefined),
      });
      return NextResponse.json(products);
    }

    // ---- Paginated branch (shop/collections infinite scroll) ----
    const page = Math.max(1, parseInt(pageParam!) || 1);
    const pageSize = Math.min(48, Math.max(1, limit ?? 12));
    const skip = (page - 1) * pageSize;

    // Extra filters only relevant to the shop grid.
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock") === "true";
    const hasDiscount = searchParams.get("hasDiscount") === "true";
    const sort = searchParams.get("sort") || "newest";

    if (minPrice !== null || maxPrice !== null) {
      where.price = {
        ...(minPrice !== null ? { gte: Number(minPrice) } : {}),
        ...(maxPrice !== null ? { lte: Number(maxPrice) } : {}),
      };
    }
    if (inStock) where.stock = { gt: 0 };
    if (hasDiscount) where.discount = { gt: 0 };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "price-low"
        ? { price: "asc" }
        : sort === "price-high"
        ? { price: "desc" }
        : sort === "popularity"
        ? { reviews: { _count: "desc" } }
        : { createdAt: "desc" };

    // Run the page query, the matching-count, and the global price ceiling
    // (used by the price slider) together.
    const [items, total, priceAgg] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where: { isDeleted: false },
        _max: { price: true },
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      hasMore: skip + items.length < total,
      priceMax: priceAgg._max.price ?? 0,
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
