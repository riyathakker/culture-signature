declare module "@cashfreepayments/cashfree-js" {
  interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal";
  }

  interface CashfreeCheckoutResult {
    paymentDetails?: { paymentMessage: string };
    error?: { message: string; type: string };
    redirect?: boolean;
  }

  interface Cashfree {
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
  }

  export function load(config: { mode: "sandbox" | "production" }): Promise<Cashfree>;
}
