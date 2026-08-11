import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [limitedDrops, exhibitions] = await Promise.all([
      prisma.product.findMany({
        where: { isDeleted: false, isLimitedDrop: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { category: true },
      }),
      prisma.exhibition.findMany({
        where: {
          isDeleted: false,
          // Show only exhibitions that are not yet past (status is derived from
          // dates): those still running (end date today or later) or single-day
          // events (no end date) whose date is today or later.
          OR: [
            { endDate: { gte: startOfToday } },
            { AND: [{ endDate: null }, { date: { gte: startOfToday } }] },
          ],
        },
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
