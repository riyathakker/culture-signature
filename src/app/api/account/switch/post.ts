import { NextResponse, type NextRequest } from "next/server";
import {
  ALT_COOKIE,
  decodeSessionToken,
  getActiveCookieName,
  sessionCookieOptions,
} from "@/lib/altSession";

/**
 * Swaps the active and alternate session cookies, making the second account
 * active. Returns the newly-active role so the client can route appropriately.
 */
export default async function handler(req: NextRequest) {
  const activeName = getActiveCookieName(req);
  const active = req.cookies.get(activeName)?.value;
  const alt = req.cookies.get(ALT_COOKIE)?.value;

  if (!active || !alt) {
    return NextResponse.json(
      { error: "No second account to switch to." },
      { status: 400 }
    );
  }

  const altToken = await decodeSessionToken(alt, activeName);
  if (!altToken) {
    // Alternate token is corrupt/expired — drop it rather than break switching.
    const res = NextResponse.json(
      { error: "The other account's session expired. Please add it again." },
      { status: 410 }
    );
    res.cookies.set(ALT_COOKIE, "", { ...sessionCookieOptions(activeName), maxAge: 0 });
    return res;
  }

  const res = NextResponse.json({ role: (altToken.role as string) ?? "USER" });
  res.cookies.set(activeName, alt, sessionCookieOptions(activeName));
  res.cookies.set(ALT_COOKIE, active, sessionCookieOptions(activeName));
  return res;
}
