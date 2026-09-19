import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Same generic response whether or not the email is already registered, so the
// endpoint can't be used to enumerate accounts.
const GENERIC = "If the email is valid, a verification code has been sent.";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  // Cap by IP and by email to curb spamming a victim's inbox.
  if (!rateLimit(`otp-send-ip:${ip}`, 8, 15 * 60 * 1000).allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    if (!rateLimit(`otp-send-email:${normalizedEmail}`, 5, 15 * 60 * 1000).allowed) {
      return NextResponse.json({ error: "Too many codes requested. Please try again later." }, { status: 429 });
    }

    // Don't issue codes for emails that already have an account.
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ message: GENERIC });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.emailOtp.upsert({
      where: { email: normalizedEmail },
      update: { codeHash: hashOtp(code), expiresAt, attempts: 0 },
      create: { email: normalizedEmail, codeHash: hashOtp(code), expiresAt },
    });

    const sent = await sendOtpEmail(normalizedEmail, code);
    if (!sent) {
      // Don't leave the user waiting for a code that never arrives.
      return NextResponse.json(
        { error: "We couldn't send the verification email right now. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: GENERIC });
  } catch (error) {
    console.error("[OTP_SEND]", error);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
