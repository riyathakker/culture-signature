import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: (session.user as any).id,
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

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = body;

    if (!street || !city || !state || !zipCode || !country) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const userId = (session.user as any).id;

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

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = body;

    const userId = (session.user as any).id;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id, userId },
      data: { firstName, lastName, street, city, state, zipCode, country, phone, isDefault },
    });

    return NextResponse.json(address);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const userId = (session.user as any).id;

    await prisma.address.update({
      where: { id, userId },
      data: { isDeleted: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
