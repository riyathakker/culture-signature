import { NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";

export async function POST(req: Request) {
  try {
    const { cf_order_id } = await req.json();

    if (!cf_order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const result = await PaymentService.verifyPayment(cf_order_id);
    console.log(`[CASHFREE_VERIFY] order=${cf_order_id} success=${result.success} paymentId=${result.paymentId}`);

    if (result.success) {
      return NextResponse.json({ success: true, paymentId: result.paymentId });
    } else {
      return NextResponse.json({ success: false, error: "Payment not completed" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[CASHFREE_VERIFY]", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
