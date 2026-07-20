import { createCashfreeOrder, getCashfreeOrder, getCashfreePayments } from "@/lib/cashfree";

export class PaymentService {
  static async createOrder(
    amount: number,
    customerDetails: {
      id: string;
      name: string;
      email: string;
      phone: string;
    },
    currency: string = "INR"
  ) {
    const orderId = `CF_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: Math.round(amount * 100) / 100,
      order_currency: currency,
      customer_details: {
        customer_id: customerDetails.id || `guest_${Date.now()}`,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      },
    });

    return order;
  }

  static async verifyPayment(cfOrderId: string): Promise<{ success: boolean; paymentId?: string }> {
    const order = await getCashfreeOrder(cfOrderId);

    if (order.order_status !== "PAID") {
      return { success: false };
    }

    const payments = await getCashfreePayments(cfOrderId);
    const successPayment = payments.find((p: any) => p.payment_status === "SUCCESS");
    const paymentId = successPayment?.cf_payment_id?.toString() || cfOrderId;

    return { success: true, paymentId };
  }
}
