import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Use a transaction to mark everything as deleted
    await prisma.$transaction([
      // 1. Mark User as deleted
      prisma.user.update({
        where: { id: userId },
        data: { isDeleted: true },
      }),
      // 2. Mark Addresses as deleted
      prisma.address.updateMany({
        where: { userId },
        data: { isDeleted: true },
      }),
      // 3. Mark Orders as deleted
      prisma.order.updateMany({
        where: { userId },
        data: { isDeleted: true },
      }),
      // 4. Mark Reviews as deleted
      prisma.review.updateMany({
        where: { userId },
        data: { isDeleted: true },
      }),
      // 5. Optionally delete wishlist items permanently as they aren't critical history
      prisma.wishlistItem.deleteMany({
        where: { userId },
      }),
    ]);

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}
