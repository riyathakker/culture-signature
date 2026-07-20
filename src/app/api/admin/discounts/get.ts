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
  const pageVal = searchParams.get("page");
  const limitVal = searchParams.get("limit");

  try {
    const where = {
      OR: [
        { code: { contains: query, mode: "insensitive" as const } },
      ],
      isDeleted: false,
    };

    const orderBy = {
      createdAt: "desc" as const,
    };

    if (pageVal && limitVal) {
      const page = parseInt(pageVal);
      const limit = parseInt(limitVal);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.discount.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.discount.count({
          where,
        }),
      ]);

      return NextResponse.json({ items, total });
    }

    const discounts = await prisma.discount.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error("[DISCOUNTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
