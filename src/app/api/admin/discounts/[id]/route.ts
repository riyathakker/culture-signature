import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { code, type, value, usageLimit, expiryDate, status } = body;

    const discount = await prisma.discount.update({
      where: { id },
      data: {
        code,
        type,
        value: value ? parseFloat(value) : undefined,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status,
      },
    });

    return NextResponse.json(discount);
  } catch (error) {
    console.error("[DISCOUNT_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Soft delete
    await prisma.discount.update({
      where: { id },
      data: { isDeleted: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DISCOUNT_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
