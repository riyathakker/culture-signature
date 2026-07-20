import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const pageVal = searchParams.get("page");
  const limitVal = searchParams.get("limit");

  try {
    const where = {
      AND: [
        query ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        } : {},
        role ? { role: role as any } : {},
        { isDeleted: false },
      ],
    };

    const include = {
      orders: true,
    };

    const orderBy = {
      createdAt: "desc" as const,
    };

    if (pageVal && limitVal) {
      const page = parseInt(pageVal);
      const limit = parseInt(limitVal);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.user.count({
          where,
        }),
      ]);

      return NextResponse.json({ items, total });
    }

    const users = await prisma.user.findMany({
      where,
      include,
      orderBy,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
