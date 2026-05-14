import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;

    const discount = await prisma.discount.findFirst({
      where: { 
        code: code.toUpperCase(),
        isDeleted: false
      }
    });

    if (!discount) {
      return NextResponse.json({ error: "Invalid promotional code" }, { status: 404 });
    }

    // Check status
    if (discount.status !== "ACTIVE") {
      return NextResponse.json({ error: "This promotional code is not active" }, { status: 400 });
    }

    // Check expiry
    if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) {
      return NextResponse.json({ error: "This promotional code has expired" }, { status: 400 });
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json({ error: "This promotional code has reached its usage limit" }, { status: 400 });
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error("[PROMO_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
