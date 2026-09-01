import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MIN_PASSWORD_LENGTH = 8;
const GENERIC_MESSAGE =
  "If this email isn't already registered, your account has been created. You can now sign in.";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`signup:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ message: "Too many signup attempts. Please try again later." }, { status: 429 });
  }

  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 201 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
