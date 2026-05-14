import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    const categories = await prisma.category.findMany({
      where: {
        status: includeArchived ? undefined : "ACTIVE",
        isDeleted: false,
      },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
