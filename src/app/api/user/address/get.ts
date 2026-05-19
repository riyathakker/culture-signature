import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const userId = req.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
        isDeleted: false
      },
      orderBy: { isDefault: "desc" }
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
