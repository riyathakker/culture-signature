import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateDiscounts() {
  console.log("Starting discount status update...");
  const now = new Date();

  try {
    // 1. Expire by Date
    const dateResult = await prisma.discount.updateMany({
      where: {
        status: "ACTIVE",
        expiryDate: { lt: now },
        isDeleted: false,
      },
      data: { status: "EXPIRED" },
    });
    console.log(`Expired ${dateResult.count} discounts by date.`);

    // 2. Expire by Usage
    const activeDiscounts = await prisma.discount.findMany({
      where: {
        status: "ACTIVE",
        usageLimit: { not: null },
        isDeleted: false,
      },
    });

    const toExpire = activeDiscounts.filter(d => d.usageLimit && d.usedCount >= d.usageLimit);
    
    if (toExpire.length > 0) {
      const usageResult = await prisma.discount.updateMany({
        where: { id: { in: toExpire.map(d => d.id) } },
        data: { status: "EXPIRED" },
      });
      console.log(`Expired ${usageResult.count} discounts by usage limit.`);
    }

    console.log("Discount status update completed.");
  } catch (error) {
    console.error("Error updating discounts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDiscounts();
