"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { Truck, ShieldCheck, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface OrderSummaryProps {
  variant?: "cart" | "checkout";
}

export function OrderSummary({ variant = "cart" }: OrderSummaryProps) {
  const { items } = useCartStore();
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a valid promotional code.");
      return;
    }
    
    const discountAmount = subtotal * 0.10;
    setAppliedDiscount({ code: promoCode.toUpperCase(), amount: discountAmount });
    toast.success(`Promotional code ${promoCode.toUpperCase()} applied!`);
    setPromoCode("");
  };

  const removePromo = () => {
    setAppliedDiscount(null);
    toast.info("Promotional code removed.");
  };

  const discountValue = appliedDiscount ? appliedDiscount.amount : 0;
  const taxableAmount = subtotal - discountValue;
  const gstAmount = taxableAmount * 0.18;
  const total = taxableAmount + gstAmount;

  return (
    <div className="bg-secondary/10 p-8 rounded-sm space-y-8 sticky top-32">
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
              <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          ))}
          <Separator className="bg-border/50" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        {appliedDiscount && (
          <div className="flex justify-between text-sm uppercase tracking-widest text-primary">
            <span className="flex items-center gap-2">
              Discount ({appliedDiscount.code})
              {variant === "cart" && (
                <button onClick={removePromo} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
            <span className="font-bold">-₹{discountValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-primary font-bold">Complimentary</span>
        </div>
        
        <div className="flex justify-between text-sm uppercase tracking-widest">
          <span className="text-muted-foreground">Estimated Tax (18% GST)</span>
          <span className="font-medium">₹{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        <Separator className="bg-border/50" />
        <div className="flex justify-between text-xl font-heading">
          <span>{variant === "checkout" ? "Final Total" : "Total"}</span>
          <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Coupon Section - Only for Cart */}
      {variant === "cart" && (
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Promotional Code</p>
          <div className="flex gap-2">
            <Input 
              placeholder="CODE" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="rounded-none bg-background border-border/50 focus-visible:ring-primary h-11 uppercase text-xs tracking-widest"
            />
            <Button 
              onClick={handleApplyPromo}
              variant="outline" 
              className="h-11 px-6 uppercase tracking-widest text-[10px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {variant === "cart" ? (
          <Link href="/bag/checkout" >
            <Button className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto">
              Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button className="w-full py-7 uppercase tracking-[0.2em] text-xs h-auto">
            Finalize Purchase <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
        
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
          {variant === "cart" 
            ? "Complimentary shipping on all orders. Secure payment processed via Stripe." 
            : "By clicking Finalize Purchase, you agree to our Terms of Service."}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <Truck className="w-4 h-4 text-primary opacity-60" />
          <span>Express <br/> Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-primary opacity-60" />
          <span>Secure <br/> Payment</span>
        </div>
      </div>
    </div>
  );
}

// Keep CartSummary as a wrapper for backward compatibility
export function CartSummary() {
  return <OrderSummary variant="cart" />;
}
