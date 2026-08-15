import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { reverseGeocodeCity } from "@/lib/geocode";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    // Re-resolve the city whenever a location link is present on update.
    const data = "location" in body ? { ...body, city: await reverseGeocodeCity(body.location) } : body;
    const exhibition = await prisma.exhibition.update({ where: { id }, data });
    return NextResponse.json(exhibition);
  } catch (e) {
    console.error("[EXHIBITION_PATCH]", e);
    return NextResponse.json({ error: (e as Error)?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.exhibition.update({ where: { id }, data: { isDeleted: true } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
