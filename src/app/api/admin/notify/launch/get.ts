import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function handler() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [total, notified] = await Promise.all([
      prisma.notifySubscriber.count({ where: { isDeleted: false } }),
      prisma.notifySubscriber.count({ where: { isDeleted: false, notified: true } }),
    ]);
    return NextResponse.json({ total, notified, pending: total - notified });
  } catch (e) {
    console.error("[/api/admin/notify/launch GET]", e);
    return NextResponse.json({ error: "Failed to load waitlist stats." }, { status: 500 });
  }
}
