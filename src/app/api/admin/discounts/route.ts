import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";

  try {
    const discounts = await prisma.discount.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: "insensitive" } },
        ],
        status: status ? status : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error("[DISCOUNTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type, value, usageLimit, expiryDate, status } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.discount.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const discount = await prisma.discount.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json(discount);
  } catch (error) {
    console.error("[DISCOUNTS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
