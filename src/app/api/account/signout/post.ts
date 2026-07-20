import { NextResponse, type NextRequest } from "next/server";
import {
  ALT_COOKIE,
  decodeSessionToken,
  getActiveCookieName,
  sessionCookieOptions,
} from "@/lib/altSession";

/**
 * Signs out the active account. If an alternate account is present it is
 * promoted to active (Google-style), otherwise the session is fully cleared.
 */
export default async function handler(req: NextRequest) {
  const activeName = getActiveCookieName(req);
  const alt = req.cookies.get(ALT_COOKIE)?.value;

  if (alt) {
    const altToken = await decodeSessionToken(alt, activeName);
    if (altToken) {
      const res = NextResponse.json({
        promoted: true,
        role: (altToken.role as string) ?? "USER",
      });
      res.cookies.set(activeName, alt, sessionCookieOptions(activeName));
      res.cookies.set(ALT_COOKIE, "", { ...sessionCookieOptions(activeName), maxAge: 0 });
      return res;
    }
  }

  const cleared = { ...sessionCookieOptions(activeName), maxAge: 0 };
  const res = NextResponse.json({ promoted: false });
  res.cookies.set(activeName, "", cleared);
  // Clear potential chunked variants NextAuth may have written.
  res.cookies.set(`${activeName}.0`, "", cleared);
  res.cookies.set(`${activeName}.1`, "", cleared);
  res.cookies.set(ALT_COOKIE, "", cleared);
  return res;
}
