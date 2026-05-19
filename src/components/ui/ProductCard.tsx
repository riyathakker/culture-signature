"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { QuickViewModal } from "./QuickViewModal";
import { useWishlistStore } from "@/store/wishlistStore";
import { QuantitySelector } from "./QuantitySelector";
import { convertINRToDiscountPercentage } from "@/utils/helper";
import { useSession } from "next-auth/react";

import { useTranslation } from "@/context/TranslationContext";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "wishlist";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const pathname = usePathname();
  const from = pathname.startsWith("/collections") ? "collections" : pathname.startsWith("/categories") ? "categories" : null;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { t } = useTranslation();

  const cartItem = items.find((item) => item.id === product.id);
  const isOutOfStock = product.stock == 0;
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error(t("shop.product.unavailable"));
      return;
    }
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price - (product.discount || 0),
      quantity: 1,
      image: product.images?.[0] || "",
      stock: product.stock,
    };
    addItem(item);
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} ${t("shop.product.removedFromWishlist")}`);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = convertINRToDiscountPercentage(product.price, product.discount);

  return (
    <>
    <Link href={`/product/${product.id}${from ? `?from=${from}` : ""}`}>
      <div className={cn(
        "group relative bg-background rounded-lg overflow-hidden transition-all duration-500",
        isOutOfStock && "grayscale-[0.5]"
      )}>
        {/* Image Container */}
        <div className="aspect-[3/4] overflow-hidden bg-secondary/30 relative rounded-lg">
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="bg-background/90 text-foreground px-6 py-3 text-[10px] uppercase tracking-[0.4em] font-bold border border-border shadow-2xl animate-in fade-in zoom-in duration-700">
                {t("shop.product.outOfStock")}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {discountPercentage && !isOutOfStock && (
              <span className="text-[10px] uppercase tracking-widest bg-destructive/60 text-white px-2 py-1 font-bold">
                -{discountPercentage}% {t("shop.product.off")}
              </span>
            )}
            {product.isNew && !isOutOfStock && (
              <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 font-bold">
                {t("shop.product.new")}
              </span>
            )}
          </div>

          {/* Actions Overlay */}
          <div className={cn(
            "absolute bottom-4 left-0 w-full px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2",
            isOutOfStock && "group-hover:opacity-40 pointer-events-none"
          )}>
            {!isAdmin ? (
              cartItem ? (
                <div className="flex-1" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                  <QuantitySelector
                    quantity={cartItem.quantity}
                    onUpdate={(newQty) => {
                      if (newQty === 0) {
                        removeItem(product.id);
                      } else {
                        updateQuantity(product.id, newQty);
                      }
                    }}
                    className="w-full bg-background/90 backdrop-blur-sm border-none h-10"
                    size="sm"
                  />
                </div>
              ) : (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  disabled={isOutOfStock}
                  className="flex-1 bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-none backdrop-blur-sm uppercase text-[10px] tracking-widest h-10"
                >
                  {isOutOfStock ? t("shop.product.unavailable") : t("shop.product.addToCart")}
                </Button>
              )
            ) : null}
            {variant !== "wishlist" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsQuickViewOpen(true); }}
                  className={cn(
                    "bg-background/90 border-none backdrop-blur-sm hover:text-primary h-10 w-10 rounded-full",
                    isAdmin && "flex-1 w-auto px-4 gap-2 text-[10px] uppercase tracking-widest font-bold"
                  )}
                >
                  <Eye className="w-4 h-4" />
                  {isAdmin && t("shop.product.quickView")}
                </Button>
                {!isAdmin && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleWishlist(e); }}
                    className={cn(
                      "bg-background/90 border-none backdrop-blur-sm h-10 w-10 rounded-full transition-colors",
                      isWishlisted ? "text-primary fill-primary" : "hover:text-primary"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className={cn(
            "w-full h-full relative overflow-hidden transition-opacity duration-500",
            isOutOfStock ? "opacity-40" : "opacity-100"
          )}>
            <div className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out group-hover:scale-110",
            )}>
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted animate-pulse" />
              )}
            </div>
          </div>
        </div>

        <div className={cn(
          "py-4 space-y-2 transition-opacity duration-500",
          isOutOfStock ? "opacity-50" : "opacity-100"
        )}>
          <div className="flex justify-between items-center">
            <p className="text-luxury italic opacity-60 text-[10px]">
              {typeof product.category === 'string' ? product.category : product.category?.name || t("shop.product.defaultCollection")}
            </p>
            <div className="flex items-center text-primary/80">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] ml-1 font-sans font-medium text-muted-foreground">{product.rating || 5}</span>
            </div>
          </div>

          <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
              {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base font-bold">₹{(product.price - product.discount).toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="text-xs text-muted-foreground line-through opacity-50">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {isOutOfStock && (
              <span className="text-[8px] uppercase tracking-widest font-bold text-destructive bg-destructive/5 px-2 py-1 border border-destructive/20">
                {t("shop.product.soldOut")}
              </span>
            )}
          </div>
        </div>
      </div>
      </Link>

      <QuickViewModal
        product={product}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </>
  );
}
