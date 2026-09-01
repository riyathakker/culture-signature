import {
  createRazorpayOrder,
  fetchRazorpayPayment,
  verifyRazorpaySignature,
} from "@/lib/razorpay";

export class PaymentService {
  static async createOrder(
    amount: number,
    customerDetails: {
      id?: string;
      name: string;
      email: string;
      phone: string;
    },
    currency: string = "INR"
  ) {
    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}_${(customerDetails.id ?? "guest").slice(0, 8)}`,
      notes: {
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      },
    });

    return order;
  }

  /**
   * Verifies a completed Razorpay checkout. First checks the HMAC signature
   * the client received (proves authenticity), then fetches the payment
   * server-side to confirm it was actually captured and to read the
   * authoritative amount — never trust client-sent amount/status.
   */
  static async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<{ success: boolean; paymentId?: string; amountPaid?: number }> {
    const signatureValid = verifyRazorpaySignature(params);
    if (!signatureValid) {
      return { success: false };
    }

    const payment = await fetchRazorpayPayment(params.paymentId);

    // Razorpay marks a successful payment as "captured" (or "authorized" when
    // capture is deferred). Reject anything else.
    if (payment.status !== "captured" && payment.status !== "authorized") {
      return { success: false };
    }

    // The payment must belong to the order it claims to.
    if (payment.order_id !== params.orderId) {
      return { success: false };
    }

    // amount is in paise → convert back to rupees.
    const amountPaid = Number(payment.amount) / 100;

    return { success: true, paymentId: params.paymentId, amountPaid };
  }
}
