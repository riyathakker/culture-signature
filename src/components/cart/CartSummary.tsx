"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useProductStore } from "@/store/productStore";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";
import { Truck, ShieldCheck, ArrowRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/context/TranslationContext";
interface OrderSummaryProps {
  variant?: "cart" | "checkout";
}

export function OrderSummary({ variant = "cart" }: OrderSummaryProps) {
  const { t } = useTranslation();
  const { items, appliedPromo, setAppliedPromo, getDiscountAmount, clearCart } = useCartStore();
  const { shippingAddress, resetCheckout } = useCheckoutStore();
  const { fetchFeaturedProducts, fetchNewArrivals } = useProductStore();
  const { fetchOrders } = useOrderStore();
  const { openModal } = useAuthStore();
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [processingStage, setProcessingStage] = useState<"verifying" | "recording" | null>(null);
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error(t("cart.summary.messages.invalidCode"));
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch(`/api/promos/${promoCode.toUpperCase()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("cart.summary.messages.invalidOrExpiredCode"));
      }

      setAppliedPromo(data);
      toast.success(t("cart.summary.messages.codeApplied", { code: promoCode.toUpperCase() }));
      setPromoCode("");
    } catch (error: any) {
      toast.error(error.message || t("cart.summary.messages.invalidOrExpiredCode"));
      setAppliedPromo(null);
    } finally {
      setIsApplying(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const handleFinalize = async () => {
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      toast.error(t("cart.summary.messages.completeShipping"));
      return;
    }

    setIsFinalizing(true);
    try {
      const orderResponse = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          customerEmail: session?.user?.email || "guest@culturesignature.com",
          customerPhone: shippingAddress.phone,
        }),
      });

      if (!orderResponse.ok) {
        const err = await orderResponse.json();
        throw new Error(err.error || "Failed to create payment order");
      }

      const { payment_session_id, cf_order_id } = await orderResponse.json();

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode: (process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as "sandbox" | "production") || "sandbox",
      });

      const result = await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed or was cancelled.");
      }

      setProcessingStage("verifying");

      let verifyData: any = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 1500));
        const verifyResponse = await fetch("/api/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cf_order_id }),
        });
        verifyData = await verifyResponse.json();
        if (verifyData.success) break;
      }

      if (!verifyData?.success) {
        throw new Error("Payment verification failed. Please contact support.");
      }

      setProcessingStage("recording");

      const finalizeResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalPrice: total,
          discountAmount: discountValue,
          promoCode: appliedPromo?.code,
          shippingAddress,
          paymentId: verifyData.paymentId,
          cf_order_id,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
        }),
      });

      if (!finalizeResponse.ok) {
        const errData = await finalizeResponse.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to record your order. Please contact support.");
      }

      const order = await finalizeResponse.json();
      toast.success(t("cart.summary.messages.orderSuccess"));

      await clearCart();
      resetCheckout();
      fetchFeaturedProducts(true);
      fetchNewArrivals(true);
      fetchOrders(true);
      router.refresh();
      router.push(`/bag/checkout/success?id=${order.id}`);

    } catch (error: any) {
      console.error("Finalize error:", error);
      toast.error(error.message || t("cart.summary.messages.orderError"));
      setProcessingStage(null);
      setIsFinalizing(false);
    }
  };

  // User Calculation Logic: (Total value without GST - Discount) + GST
  const discountValue = getDiscountAmount();
  const taxableAmount = subtotal - discountValue;

  const shippingThreshold = 5000;
  const shippingCost = (taxableAmount > 0 && taxableAmount >= shippingThreshold) ? 0 : 200;

  const gstAmount = taxableAmount * 0.18;
  const total = taxableAmount + gstAmount + shippingCost;

  return (
    <div className="bg-secondary/30 p-8 rounded-sm space-y-8 sticky top-32 border border-border/10 shadow-luxury">
      <h3 className="text-2xl font-heading">
        {variant === "checkout" ? t("cart.summary.reviewTitle") : t("cart.summary.title")}
      </h3>

      {variant === "checkout" && (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="w-12 h-16 bg-muted rounded-sm relative flex-shrink-0 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-luxury-gradient opacity-10" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {t("cart.summary.qty", { count: item.quantity })}
                </p>
              </div>
              <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          ))}
          <Separator className="bg-border/50" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">{t("cart.summary.subtotal")}</span>
          <span className="font-medium">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-sm uppercase tracking-widest text-primary animate-in fade-in slide-in-from-right-4 duration-500">
            <span className="flex items-center gap-2">
              {appliedPromo.code}
              {variant === "cart" && (
                <button onClick={removePromo} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
            <span className="font-bold">-₹{discountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">{t("cart.summary.shipping")}</span>
          {shippingCost === 0 ? (
            <span className="text-primary font-bold">{t("cart.summary.shippingComplimentary")}</span>
          ) : (
            <span className="font-medium">₹{shippingCost.toLocaleString()}</span>
          )}
        </div>

        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">{t("cart.summary.estimatedTax")}</span>
          <span className="font-medium">₹{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <Separator className="bg-border/50" />
        <div className="flex justify-between text-xl font-heading text-primary">
          <span>{variant === "checkout" ? t("cart.summary.finalTotal") : t("cart.summary.total")}</span>
          <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Coupon Section - Only for Cart */}
      {variant === "cart" && (
        <div className="space-y-3 pt-4 border-t border-border/20">
          <p className="text-spaced-bold text-muted-foreground">{t("cart.summary.promotionalCode")}</p>
          <div className="flex gap-2">
            <Input
              placeholder={t("cart.summary.codePlaceholder")}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="h-11 text-xs tracking-widest bg-background border-none shadow-inner uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
            />
            <Button
              onClick={handleApplyPromo}
              disabled={isApplying}
              variant="outline"
              className="h-11 px-6 uppercase tracking-widest text-[10px] border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : t("cart.summary.apply")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!isAdmin ? (
          variant === "cart" ? (
            session?.user ? (
              <Link href="/bag/checkout" className="block">
                <Button className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20">
                  {t("cart.summary.proceedToCheckout")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => openModal("/bag/checkout")}
                className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20"
              >
                Sign In to Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )
          ) : (
            <Button
              onClick={handleFinalize}
              disabled={isFinalizing || items.length === 0}
              className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20"
            >
              {isFinalizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t("cart.summary.finalizeAcquisition")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )
        ) : (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm text-center">
            <p className="text-spaced-bold text-primary">{t("cart.summary.adminPreview.title")}</p>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest leading-relaxed">
              {t("cart.summary.adminPreview.description")}
            </p>
          </div>
        )}

        {!isAdmin && (
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed mt-2 px-4">
            {variant === "cart"
              ? t("cart.summary.footerNote", { threshold: shippingThreshold.toLocaleString() })
              : t("cart.summary.footerNoteCheckout")}
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <Truck className="w-4 h-4 text-primary opacity-60" />
          <span>{t("cart.summary.badges.expressDelivery").split(' ').slice(0, 2).join(' ')} <br /> {t("cart.summary.badges.expressDelivery").split(' ').slice(2).join(' ')}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary opacity-60" />
          <span>{t("cart.summary.badges.securePayment").split(' ').slice(0, 1).join(' ')} <br /> {t("cart.summary.badges.securePayment").split(' ').slice(1).join(' ')}</span>
        </div>
      </div>

      {/* Full-screen processing overlay */}
      {processingStage && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
          <div className="flex flex-col items-center gap-8 max-w-sm text-center px-8">
            {/* Animated ring */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border border-primary/10" />
              <ShieldCheck className="absolute inset-0 m-auto w-7 h-7 text-primary opacity-70" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-heading tracking-widest uppercase">
                {processingStage === "verifying" ? "Confirming Payment" : "Securing Your Order"}
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                {processingStage === "verifying"
                  ? "Verifying your payment with our secure gateway. Please do not close this window."
                  : "Recording your order and preparing confirmation. Almost there."}
              </p>
            </div>

            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export function CartSummary() {
  return <OrderSummary variant="cart" />;
}
