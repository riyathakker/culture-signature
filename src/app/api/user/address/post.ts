import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const userId = req.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = body;

    if (!street || !city || !state || !zipCode || !country) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        firstName,
        lastName,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
