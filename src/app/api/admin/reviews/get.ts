import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }) {
    const session = await auth();

    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { isDeleted: false },
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(reviews);
    } catch (e: any) {
        console.error("[ADMIN_REVIEWS_GET]", e);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}