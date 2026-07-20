import { encode, decode, type JWT } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const SECRET = process.env.AUTH_SECRET as string;
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days, matches the JWT session default

const SECURE_COOKIE = "__Secure-authjs.session-token";
const PLAIN_COOKIE = "authjs.session-token";

/** Cookie holding the second, inactive account's session token. */
export const ALT_COOKIE = "cs.alt-session";

/** The session cookie name NextAuth is using for this request (also the JWT salt). */
export function getActiveCookieName(req: NextRequest): string {
  if (req.cookies.get(SECURE_COOKIE)) return SECURE_COOKIE;
  if (req.cookies.get(PLAIN_COOKIE)) return PLAIN_COOKIE;
  // No active session cookie present — infer from the request protocol.
  const proto =
    req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  return proto === "https" ? SECURE_COOKIE : PLAIN_COOKIE;
}

export function sessionCookieOptions(cookieName: string) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieName.startsWith("__Secure-"),
    path: "/",
    maxAge: MAX_AGE,
  };
}

export async function encodeSessionToken(token: JWT, salt: string): Promise<string> {
  return encode({ token, secret: SECRET, salt, maxAge: MAX_AGE });
}

export async function decodeSessionToken(
  value: string,
  salt: string
): Promise<JWT | null> {
  try {
    return await decode({ token: value, secret: SECRET, salt });
  } catch {
    return null;
  }
}

/** Minimal identity shape surfaced to the account-switcher UI. */
export type AccountInfo = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

export function tokenToAccount(token: JWT | null): AccountInfo | null {
  if (!token) return null;
  const id = (token.id as string) ?? (token.sub as string);
  if (!id) return null;
  return {
    id,
    name: (token.name as string) ?? null,
    email: (token.email as string) ?? null,
    role: (token.role as string) ?? "USER",
  };
}
