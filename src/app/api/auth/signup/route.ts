import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyOtpHash, OTP_MAX_ATTEMPTS } from "@/lib/otp";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 15;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ message: "Too many signup attempts. Please try again later." }, { status: 429 });
  }

  try {
    const { name, email, password, code } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json({ message: "Verification code is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify the emailed OTP. A valid code proves the requester controls the
    // inbox, so signup can give clear code errors without leaking whether an
    // account exists (codes are never issued for registered emails).
    const otp = await prisma.emailOtp.findUnique({ where: { email: normalizedEmail } });
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "Verification code is invalid or has expired" }, { status: 400 });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ message: "Too many attempts. Please request a new code." }, { status: 429 });
    }
    if (!verifyOtpHash(code.trim(), otp.codeHash)) {
      await prisma.emailOtp.update({
        where: { email: normalizedEmail },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ message: "Verification code is invalid or has expired" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      await prisma.emailOtp.delete({ where: { email: normalizedEmail } }).catch(() => {});
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Code consumed — remove it so it can't be reused.
    await prisma.emailOtp.delete({ where: { email: normalizedEmail } }).catch(() => {});

    return NextResponse.json(
      { message: "Account created successfully", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
