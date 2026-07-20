import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  try {
    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get("includeArchived") === "true";
    const query = searchParams.get("query") || "";
    const pageVal = searchParams.get("page");
    const limitVal = searchParams.get("limit");

    const where = {
      status: includeArchived ? undefined : "ACTIVE" as const,
      isDeleted: false,
      name: query ? { contains: query, mode: "insensitive" as const } : undefined,
    };

    const include = {
      _count: {
        select: { products: true }
      }
    };

    const orderBy = {
      name: "asc" as const,
    };

    if (pageVal && limitVal) {
      const page = parseInt(pageVal);
      const limit = parseInt(limitVal);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.category.findMany({
          where,
          include,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.category.count({
          where,
        }),
      ]);

      return NextResponse.json({ items, total });
    }

    const categories = await prisma.category.findMany({
      where,
      include,
      orderBy,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
