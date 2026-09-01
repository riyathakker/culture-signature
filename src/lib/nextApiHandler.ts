import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export default function apiHandler(handler: (req: NextRequest & { userEmail?: string; userId?: string }, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      const session = await auth();
      const extendedReq = req as NextRequest & { userEmail?: string; userId?: string };

      const sessionUserId = (session?.user as any)?.id as string | undefined;
      if (sessionUserId) {
        // The JWT bakes in role/identity at sign-in time and can outlive a
        // revoked, demoted, or soft-deleted account for up to its maxAge.
        // Re-check against the DB on every API request so revocation is
        // effectively immediate for the API surface (pages still trust the
        // JWT via middleware, but they only render — they can't mutate data).
        const dbUser = await prisma.user.findUnique({
          where: { id: sessionUserId },
          select: { isDeleted: true, role: true },
        });

        if (!dbUser || dbUser.isDeleted || dbUser.role !== (session?.user as any)?.role) {
          return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        extendedReq.userId = sessionUserId;
        if (session?.user?.email) extendedReq.userEmail = session.user.email;
      }

      return await handler(extendedReq, context);
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
  };
}
