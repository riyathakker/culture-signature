import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

// Short-lived cache of the per-user freshness check so we don't hit the DB on
// every authenticated API request (a logged-in page load fires several). A
// revoked/demoted account is still cut off within FRESHNESS_TTL_MS.
const FRESHNESS_TTL_MS = 60 * 1000;
const freshnessCache = new Map<string, { ok: boolean; role: string | null; checkedAt: number }>();

async function isSessionFresh(userId: string, sessionRole: string | undefined): Promise<boolean> {
  const now = Date.now();
  const cached = freshnessCache.get(userId);
  if (cached && now - cached.checkedAt < FRESHNESS_TTL_MS) {
    return cached.ok && cached.role === (sessionRole ?? null);
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { isDeleted: true, role: true },
  });
  const ok = !!dbUser && !dbUser.isDeleted;
  freshnessCache.set(userId, { ok, role: dbUser?.role ?? null, checkedAt: now });
  return ok && dbUser!.role === (sessionRole ?? null);
}

export default function apiHandler(handler: (req: NextRequest & { userEmail?: string; userId?: string }, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      const session = await auth();
      const extendedReq = req as NextRequest & { userEmail?: string; userId?: string };

      const sessionUserId = (session?.user as any)?.id as string | undefined;
      if (sessionUserId) {
        // The JWT bakes in role/identity at sign-in time and can outlive a
        // revoked, demoted, or soft-deleted account. Re-validate against the DB
        // (cached for 60s) so revocation takes effect promptly without a query
        // on every request.
        const fresh = await isSessionFresh(sessionUserId, (session?.user as any)?.role);
        if (!fresh) {
          freshnessCache.delete(sessionUserId);
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
