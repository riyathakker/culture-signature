import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendLaunchAnnouncement } from "@/lib/email";
import { ensureWaitlistCoupon, WAITLIST_DISCOUNT_PERCENT } from "@/lib/waitlistCoupon";

export default async function handler(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const shopUrl: string | undefined =
      typeof body.shopUrl === "string" && body.shopUrl.trim() ? body.shopUrl.trim() : undefined;

    // Everyone who hasn't been told yet.
    const pending = await prisma.notifySubscriber.findMany({
      where: { isDeleted: false, notified: false },
    });

    let sent = 0;
    const failed: string[] = [];

    // Sequential to stay well within email-provider rate limits.
    for (const sub of pending) {
      try {
        const { code, expiryDate } = await ensureWaitlistCoupon(sub.couponCode);
        await sendLaunchAnnouncement({
          to: sub.email,
          code,
          percent: WAITLIST_DISCOUNT_PERCENT,
          expiryDate,
          shopUrl,
        });
        // Mark notified only after a successful send so a retry re-attempts failures.
        await prisma.notifySubscriber.update({
          where: { id: sub.id },
          data: { notified: true, couponCode: code },
        });
        sent++;
      } catch (err) {
        console.error(`[launch] failed for ${sub.email}`, err);
        failed.push(sub.email);
      }
    }

    return NextResponse.json({ ok: true, sent, failed: failed.length, failedEmails: failed });
  } catch (e) {
    console.error("[/api/admin/notify/launch POST]", e);
    return NextResponse.json({ error: "Failed to send launch emails." }, { status: 500 });
  }
}
