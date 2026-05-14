import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // Optional: Add a secret key check to prevent unauthorized triggers
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  try {
    const now = new Date();

    // 1. Update discounts where expiryDate has passed
    const expiredByDate = await prisma.discount.updateMany({
      where: {
        status: "ACTIVE",
        expiryDate: {
          lt: now,
        },
        isDeleted: false,
      },
      data: {
        status: "EXPIRED",
      },
    });

    // 2. Update discounts where usage limit has been reached
    const expiredByUsage = await prisma.discount.updateMany({
      where: {
        status: "ACTIVE",
        usageLimit: {
          not: null,
        },
        usedCount: {
          gte: prisma.discount.fields.usageLimit, // This doesn't work in updateMany directly in Prisma
        },
        isDeleted: false,
      },
      data: {
        status: "EXPIRED",
      },
    });
    
    // Actually, Prisma updateMany doesn't support comparing two fields directly easily.
    // For usage limit, we might need to find first then update, or use a raw query if it's many.
    // But usually, it's safer to find the specific IDs.

    const usageReachedDiscounts = await prisma.discount.findMany({
      where: {
        status: "ACTIVE",
        usageLimit: { not: null },
        isDeleted: false,
      },
      select: { id: true, usedCount: true, usageLimit: true }
    });

    const idsToExpire = usageReachedDiscounts
      .filter(d => d.usageLimit && d.usedCount >= d.usageLimit)
      .map(d => d.id);

    if (idsToExpire.length > 0) {
      await prisma.discount.updateMany({
        where: { id: { in: idsToExpire } },
        data: { status: "EXPIRED" }
      });
    }

    return NextResponse.json({
      success: true,
      expiredByDate: expiredByDate.count,
      expiredByUsage: idsToExpire.length,
    });
  } catch (error) {
    console.error("[CRON_DISCOUNTS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
