import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  ALT_COOKIE,
  decodeSessionToken,
  getActiveCookieName,
  tokenToAccount,
  type AccountInfo,
} from "@/lib/altSession";

/**
 * Returns the active account (from the live session) and the alternate account
 * (decoded from the alt-session cookie), for the account-switcher UI.
 */
export default async function handler(req: NextRequest) {
  const session = await auth();

  let active: AccountInfo | null = null;
  if (session?.user) {
    const u = session.user as any;
    active = {
      id: u.id,
      name: u.name ?? null,
      email: u.email ?? null,
      role: u.role ?? "USER",
    };
  }

  let alt: AccountInfo | null = null;
  const altValue = req.cookies.get(ALT_COOKIE)?.value;
  if (altValue) {
    alt = tokenToAccount(await decodeSessionToken(altValue, getActiveCookieName(req)));
  }

  return NextResponse.json({ active, alt });
}
