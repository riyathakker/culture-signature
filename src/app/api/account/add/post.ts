import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  ALT_COOKIE,
  encodeSessionToken,
  getActiveCookieName,
  sessionCookieOptions,
} from "@/lib/altSession";

/**
 * Adds a second account alongside the currently active one. Verifies the
 * supplied credentials, mints a session token for that account, and stores it
 * in the alternate-session cookie. The active session is left untouched.
 */
export default async function handler(
  req: NextRequest & { userId?: string }
) {
  if (!req.userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Only two accounts are supported at once.
  if (req.cookies.get(ALT_COOKIE)?.value) {
    return NextResponse.json(
      { error: "You already have two accounts signed in. Remove one first." },
      { status: 409 }
    );
  }

  const { email, password } = await req.json();
  if (!email?.trim() || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim() },
  });

  if (!user || !user.password || user.isDeleted) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  if (user.id === req.userId) {
    return NextResponse.json(
      { error: "That account is already active." },
      { status: 409 }
    );
  }

  const activeName = getActiveCookieName(req);
  const encoded = await encodeSessionToken(
    {
      name: user.name,
      email: user.email,
      sub: user.id,
      id: user.id,
      role: user.role,
      mobileNo: user.mobileNo ?? null,
    } as any,
    activeName
  );

  const res = NextResponse.json({
    role: user.role,
    email: user.email,
    name: user.name,
  });
  res.cookies.set(ALT_COOKIE, encoded, sessionCookieOptions(activeName));
  return res;
}
