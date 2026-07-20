const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENVIRONMENT === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const CASHFREE_HEADERS = {
  "x-api-version": "2023-08-01",
  "x-client-id": process.env.CASHFREE_APP_ID!,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
  "Content-Type": "application/json",
};

export interface CashfreeOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta?: {
    return_url?: string;
    notify_url?: string;
  };
}

export interface CashfreeOrder {
  cf_order_id: string;
  order_id: string;
  order_status: string;
  payment_session_id: string;
  order_amount: number;
  order_currency: string;
}

export async function createCashfreeOrder(payload: CashfreeOrderPayload): Promise<CashfreeOrder> {
  const res = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: "POST",
    headers: CASHFREE_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create Cashfree order");
  }

  return res.json();
}

export async function getCashfreeOrder(orderId: string): Promise<any> {
  const res = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: CASHFREE_HEADERS,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch Cashfree order");
  }

  return res.json();
}

export async function getCashfreePayments(orderId: string): Promise<any[]> {
  const res = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}/payments`, {
    method: "GET",
    headers: CASHFREE_HEADERS,
  });

  if (!res.ok) return [];
  return res.json();
}
