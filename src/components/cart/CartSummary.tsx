"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Truck, ShieldCheck, ArrowRight, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface OrderSummaryProps {
  variant?: "cart" | "checkout";
}

export function OrderSummary({ variant = "cart" }: OrderSummaryProps) {
  const { items, appliedPromo, setAppliedPromo, getDiscountAmount, clearCart } = useCartStore();
  const { shippingAddress, resetCheckout } = useCheckoutStore();
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a valid promotional code.");
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch(`/api/promos/${promoCode.toUpperCase()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid promo code");
      }

      setAppliedPromo(data);
      toast.success(`Promotional code ${promoCode.toUpperCase()} applied!`);
      setPromoCode("");
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired promotional code.");
      setAppliedPromo(null);
    } finally {
      setIsApplying(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    toast.info("Promotional code removed.");
  };

  const handleFinalize = async () => {
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      toast.error("Please complete your shipping information.");
      // Scroll to top to see errors if needed, but for now just toast
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
      toast.success("Order finalized successfully!");
      
      // Clear cart and reset checkout
      await clearCart();
      resetCheckout();
      
      // Redirect to success page
      router.push(`/bag/checkout/success?id=${order.id}`);
    } catch (error) {
      console.error("Finalize error:", error);
      toast.error("Something went wrong while finalizing your order.");
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
        {variant === "checkout" ? "Order Review" : "Order Summary"}
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          ))}
          <Separator className="bg-border/50" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">Value (excl. GST)</span>
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
          <span className="text-muted-foreground">Shipping</span>
          {shippingCost === 0 ? (
            <span className="text-primary font-bold">Complimentary</span>
          ) : (
            <span className="font-medium">₹{shippingCost.toLocaleString()}</span>
          )}
        </div>

        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">Estimated GST (18%)</span>
          <span className="font-medium">₹{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <Separator className="bg-border/50" />
        <div className="flex justify-between text-xl font-heading text-primary">
          <span>{variant === "checkout" ? "Final Total" : "Total Amount"}</span>
          <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Coupon Section - Only for Cart */}
      {variant === "cart" && (
        <div className="space-y-3 pt-4 border-t border-border/20">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Promotional Privilege</p>
          <div className="flex gap-2">
            <Input
              placeholder="ENTER CODE"
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
              {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!isAdmin ? (
          variant === "cart" ? (
            <Link href="/bag/checkout" className="block">
              <Button className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20">
                Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={handleFinalize}
              disabled={isFinalizing || items.length === 0}
              className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto shadow-xl shadow-primary/20"
            >
              {isFinalizing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Finalize Acquisition <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )
        ) : (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-sm text-center">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Admin Preview Mode</p>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest leading-relaxed">
              Transactional features are disabled for administrative accounts.
            </p>
          </div>
        )}

        {!isAdmin && (
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed mt-2 px-4">
            {variant === "cart"
              ? `Complimentary shipping above ₹${shippingThreshold.toLocaleString()}. Securely processed via Stripe.`
              : "By finalizing, you agree to our Terms of Acquisition & Service."}
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <Truck className="w-4 h-4 text-primary opacity-60" />
          <span>White Glove <br /> Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary opacity-60" />
          <span>Authenticity <br /> Guaranteed</span>
        </div>
      </div>
    </div>
  );
}

export function CartSummary() {
  return <OrderSummary variant="cart" />;
}
