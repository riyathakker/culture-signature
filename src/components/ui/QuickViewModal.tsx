"use client";

import { Star, Heart, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { IconButton } from "@/components/ui/IconButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/context/TranslationContext";

interface QuickViewModalProps {
  product: any,
  open: boolean,
  onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
    const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price - (product.discount || 0),
      quantity: quantity,
      image: product.images?.[0] || "",
      stock: product.stock,
    };
    addItem(item);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] md:max-w-4xl p-0 overflow-hidden border-none bg-background max-h-[85vh] flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="relative w-full md:w-1/2 bg-secondary/30 h-[320px] md:h-[420px] shrink-0">
          <div className="absolute inset-0 bg-luxury-gradient opacity-10" />

          {/* Main Image */}
          <img
            src={product.images?.[selectedImage || 0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Horizontal Image Slider */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex gap-2 px-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`min-w-[60px] h-[60px] rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                    ? "border-white scale-105"
                    : "border-white/30"
                    }`}
                >
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col min-h-0 bg-background">
          <ScrollArea className="flex-1">
            <div className="p-5 md:p-8 space-y-4 md:space-y-6">
              <div>
                <DialogTitle className="text-xl md:text-2xl font-heading mb-1 md:mb-2 leading-tight">
                  {product.name}
                </DialogTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3 md:w-4 h-4",
                          i < Math.floor(product.rating || 5) ? "fill-current" : "opacity-30"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-[10px] text-muted-foreground font-sans">
                      ({product.rating || 5.0})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg md:text-xl font-bold">₹{(product.price - (product.discount || 0)).toLocaleString()}</span>
                {product.discount > 0 && (
                  <span className="text-sm md:text-base text-muted-foreground line-through opacity-50">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground font-serif italic leading-relaxed text-xs md:text-sm">
                {product.description}
              </p>

              {!isAdmin && (
                <div className="space-y-4 pt-4 border-t border-border/20">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <QuantitySelector
                      quantity={quantity}
                      onUpdate={setQuantity}
                      size="sm"
                      className="h-10 md:h-12 w-full sm:w-32"
                    />
                    <div className="flex-1 flex gap-2">
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 py-3 md:py-4 uppercase tracking-[0.2em] text-[9px] md:text-[10px] h-10 md:h-12"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        {t("shop.product.addToCart")}
                      </Button>
                      <IconButton
                        icon={Heart}
                        className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0"
                        aria-label="Add to wishlist"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
