"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
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
    isNew?: boolean;
    isBestSeller?: boolean;
    discount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    addItem(item);
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        description: product.description,
      });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <>
      <div className="group relative bg-background">
        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-secondary/30 relative">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.discount && (
              <span className="text-[10px] uppercase tracking-widest bg-destructive text-destructive-foreground px-2 py-1 font-bold">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 font-bold">
                New
              </span>
            )}
          </div>

          {/* Actions Overlay */}
          <div className="absolute bottom-4 left-0 w-full px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-none backdrop-blur-sm uppercase text-[10px] tracking-widest h-10"
            >
              Add to Cart
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsQuickViewOpen(true)}
                className="bg-background/90 border-none backdrop-blur-sm hover:text-primary h-10 w-10 rounded-full"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleWishlist}
                className={cn(
                  "bg-background/90 border-none backdrop-blur-sm h-10 w-10 rounded-full transition-colors",
                  isWishlisted ? "text-primary fill-primary" : "hover:text-primary"
                )}
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>

          {/* Product Image Wrapper */}
          <div className="w-full h-full relative overflow-hidden p-12">
            {/* Primary Image */}
            <div className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out group-hover:scale-110",
              product.hoverImage ? "group-hover:opacity-0" : ""
            )}>
              <div className="absolute inset-0 bg-luxury-gradient opacity-5" />
              <div className="w-full h-full bg-muted animate-pulse" />
            </div>
            
            {/* Hover Image */}
            {product.hoverImage && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-105 group-hover:scale-110">
                <div className="absolute inset-0 bg-luxury-gradient opacity-10" />
                <div className="w-full h-full bg-muted animate-pulse border-2 border-primary/20" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="py-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-luxury italic opacity-60 text-[10px]">{product.category}</p>
            <div className="flex items-center text-primary/80">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] ml-1 font-sans font-medium text-muted-foreground">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
            <Link href={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base font-bold">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through opacity-50">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
          </div>
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        open={isQuickViewOpen} 
        onOpenChange={setIsQuickViewOpen} 
      />
    </>
  );
}
