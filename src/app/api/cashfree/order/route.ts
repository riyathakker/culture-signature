import { NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { amount, customerName, customerEmail, customerPhone } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!customerPhone || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
    }

    const order = await PaymentService.createOrder(amount, {
      id: (session?.user as any)?.id,
      name: customerName,
      email: customerEmail || session?.user?.email,
      phone: customerPhone,
    });

    return NextResponse.json({
      payment_session_id: order.payment_session_id,
      cf_order_id: order.order_id,
    });
  } catch (error: any) {
    console.error("[CASHFREE_ORDER]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
