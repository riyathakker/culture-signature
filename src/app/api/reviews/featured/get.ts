import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Public: latest, highly-rated reviews for the "Voices of Elegance" home section.
export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Math.min(Number(searchParams.get("take")) || 8, 20);

    const reviews = await prisma.review.findMany({
      where: {
        isDeleted: false,
        rating: { gte: 4 }, // mostly high ratings
        comment: { not: null }, // needs a quote to display
      },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }], // best first, then latest
      take,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    });

    return NextResponse.json(reviews);
  } catch (e) {
    console.error("[/api/reviews/featured]", e);
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
