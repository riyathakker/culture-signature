import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

const keyId = process.env.RAZOR_PAY_API_KEY;
const keySecret = process.env.RAZOR_PAY_SECRET;

if (!keyId || !keySecret) {
  console.warn("[razorpay] RAZOR_PAY_API_KEY / RAZOR_PAY_SECRET are not set");
}

export const razorpayKeyId = keyId ?? "";

const razorpay = new Razorpay({
  key_id: keyId ?? "",
  key_secret: keySecret ?? "",
});

export interface RazorpayOrder {
  id: string;
  amount: number; // in paise
  currency: string;
  status: string;
}

export async function createRazorpayOrder(params: {
  amount: number; // rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const order = await razorpay.orders.create({
    amount: Math.round(params.amount * 100), // Razorpay expects the smallest unit (paise)
    currency: params.currency ?? "INR",
    receipt: params.receipt,
    notes: params.notes,
  });
  return order as unknown as RazorpayOrder;
}

export async function fetchRazorpayPayment(paymentId: string): Promise<any> {
  return razorpay.payments.fetch(paymentId);
}

/**
 * Verifies the checkout signature Razorpay returns to the client.
 * signature === HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!keySecret) return false;
  const expected = createHmac("sha256", keySecret)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(params.signature || "");
  return a.length === b.length && timingSafeEqual(a, b);
}
