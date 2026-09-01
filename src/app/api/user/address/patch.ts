import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const userId = req.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // Scope by userId so a user can't update someone else's address; a
    // non-match (wrong owner or missing id) throws P2025 → 404, not 500.
    const address = await prisma.address.update({
      where: { id, userId },
      data: { firstName, lastName, street, city, state, zipCode, country, phone, isDefault },
    });

    return NextResponse.json(address);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    console.error("[ADDRESS_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
