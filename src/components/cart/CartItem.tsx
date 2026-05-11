"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  variant?: "drawer" | "page";
}

import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function CartItem({ item, variant = "drawer" }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className={cn(
      "flex gap-4 py-4",
      variant === "page" ? "md:gap-8 border-b last:border-0" : "border-b border-border/50 last:border-0"
    )}>
      <div className={cn(
        "bg-secondary/30 rounded-sm overflow-hidden flex-shrink-0 relative",
        variant === "page" ? "w-24 h-32 md:w-32 md:h-40" : "w-20 h-28"
      )}>
        <div className="absolute inset-0 bg-luxury-gradient opacity-10" />
        <div className="w-full h-full bg-muted animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h4 className={cn(
              "font-heading leading-tight",
              variant === "page" ? "text-xl md:text-2xl" : "text-lg"
            )}>
              {item.name}
            </h4>
            <button 
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-primary transition-all p-1 rounded-full hover:bg-secondary/50 group"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-serif italic line-clamp-2">
            Handcrafted artisanal piece with signature cultural motifs and premium finish.
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector 
            quantity={item.quantity}
            onUpdate={(newQty) => updateQuantity(item.id, newQty)}
            size="sm"
          />
          <div className="text-right">
            <p className={cn(
              "font-medium",
              variant === "page" ? "text-lg" : "text-sm"
            )}>
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                ₹{item.price.toLocaleString()} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
