import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const exhibitions = await prisma.exhibition.findMany({
      where: { isDeleted: false },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(exhibitions);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const exhibition = await prisma.exhibition.create({ data: body });
    return NextResponse.json(exhibition);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
