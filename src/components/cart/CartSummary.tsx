"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useProductStore } from "@/store/productStore";
import { useOrderStore } from "@/store/orderStore";
import { Truck, ShieldCheck, ArrowRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalPrice: total,
          discountAmount: discountValue,
          promoCode: appliedPromo?.code,
          shippingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to finalize order");
      }

      const order = await response.json();
      toast.success(t("cart.summary.messages.orderSuccess"));
      
      // Clear cart and reset checkout
      await clearCart();
      resetCheckout();

      // Refresh products to update stock levels (force bypass cache)
      fetchFeaturedProducts(true);
      fetchNewArrivals(true);
      fetchOrders(true);
      
      router.refresh();
      // Redirect to success page
      router.push(`/bag/checkout/success?id=${order.id}`);
    } catch (error) {
      console.error("Finalize error:", error);
      toast.error(t("cart.summary.messages.orderError"));
    } finally {
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
            <Link href="/bag/checkout" className="block">
              <Button className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20">
                {t("cart.summary.proceedToCheckout")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
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
    </div>
  );
}

export function CartSummary() {
  return <OrderSummary variant="cart" />;
}
