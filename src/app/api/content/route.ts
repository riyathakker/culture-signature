import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [limitedDrops, exhibitions] = await Promise.all([
      prisma.product.findMany({
        where: { isDeleted: false, isLimitedDrop: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { category: true },
      }),
      prisma.exhibition.findMany({
        where: { isDeleted: false, status: { in: ["UPCOMING", "ONGOING"] } },
        orderBy: { date: "asc" },
        take: 6,
      }),
    ]);

    return NextResponse.json({ limitedDrops, exhibitions });
  } catch (e: any) {
    console.error("[/api/content]", e);
    return NextResponse.json({ error: e?.message ?? "Internal server error" }, { status: 500 });
  }
}
