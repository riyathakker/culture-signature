"use client";

import { Star, Heart, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickViewModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    hoverImage?: string;
    category: string;
    rating: number;
    description: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { IconButton } from "@/components/ui/IconButton";

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    };
    addItem(item);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-background md:h-auto h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Product Image */}
          <div className="relative aspect-[4/5] md:aspect-auto bg-secondary/30 h-full">
            <div className="absolute inset-0 bg-luxury-gradient opacity-10" />
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <p className="text-luxury italic opacity-60 mb-2">{product.category}</p>
                <DialogTitle className="text-3xl font-heading mb-2">{product.name}</DialogTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating) ? "fill-current" : "opacity-30"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground font-sans">
                      ({product.rating})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through opacity-50">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground font-serif italic leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <QuantitySelector 
                    quantity={quantity}
                    onUpdate={setQuantity}
                    size="lg"
                    className="h-14"
                  />
                  <div className="flex-1 flex gap-2">
                    <Button 
                      onClick={handleAddToCart}
                      className="flex-1 py-4 uppercase tracking-[0.2em] text-xs h-14"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Collection
                    </Button>
                    <IconButton 
                      icon={Heart} 
                      className="w-14 h-14" 
                      aria-label="Add to wishlist" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
