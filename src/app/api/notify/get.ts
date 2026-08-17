import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export default async function handler() {
  try {
    const count = await prisma.notifySubscriber.count({ where: { isDeleted: false } });
    return NextResponse.json({ count }, { status: 200 });
  } catch (e) {
    console.error("[/api/notify GET]", e);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
