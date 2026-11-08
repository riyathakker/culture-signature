import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";

export const WAITLIST_DISCOUNT_PERCENT = 10;
export const COUPON_VALID_DAYS = 30;

// Unambiguous alphabet (no O/0, I/1) for a readable, uppercase code.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  const bytes = randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[bytes[i] % ALPHABET.length];
  return `WELCOME-${suffix}`;
}

/** Generate a code that doesn't already exist as a Discount. */
async function makeUniqueCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = makeCode();
    const existing = await prisma.discount.findFirst({ where: { code } });
    if (!existing) return code;
  }
  return `WELCOME-${randomBytes(5).toString("hex").toUpperCase()}`;
}

/**
 * Ensure a subscriber has a valid single-use 10% coupon. Reuses an existing
 * one if it's still active/unexpired/unused, otherwise mints a fresh one.
 * Returns the code + expiry to put in the launch email.
 */
export async function ensureWaitlistCoupon(existingCode?: string | null) {
  if (existingCode) {
    const current = await prisma.discount.findFirst({
      where: { code: existingCode, isDeleted: false },
    });
    const stillValid =
      current &&
      current.status === "ACTIVE" &&
      (!current.usageLimit || current.usedCount < current.usageLimit) &&
      (!current.expiryDate || new Date(current.expiryDate) > new Date());
    if (current && stillValid) {
      return { code: current.code, expiryDate: current.expiryDate ?? undefined };
    }
  }

  const code = await makeUniqueCode();
  const expiryDate = new Date(Date.now() + COUPON_VALID_DAYS * 24 * 60 * 60 * 1000);
  await prisma.discount.create({
    data: {
      code,
      type: "PERCENTAGE",
      value: WAITLIST_DISCOUNT_PERCENT,
      usageLimit: 1,
      status: "ACTIVE",
      expiryDate,
    },
  });
  return { code, expiryDate };
}
