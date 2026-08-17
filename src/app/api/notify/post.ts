import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendWaitlistWelcome } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextRequest) {
  try {
    const { email } = await req.json();
    const value = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(value)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Already subscribed → idempotent, don't re-send.
    const existing = await prisma.notifySubscriber.findUnique({ where: { email: value } });
    if (existing && !existing.isDeleted) {
      return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
    }

    // Store the email. The 10% coupon is issued & emailed at launch, not now —
    // so the coupon's validity window starts when the store actually opens.
    await prisma.notifySubscriber.upsert({
      where: { email: value },
      update: { isDeleted: false },
      create: { email: value },
    });

    // Best-effort confirmation — a delivery failure shouldn't fail the signup.
    await sendWaitlistWelcome({ to: value });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[/api/notify]", e);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
