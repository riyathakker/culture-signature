"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Eye, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { QuickViewModal } from "./QuickViewModal";
import { useWishlistStore } from "@/store/wishlistStore";
import { QuantitySelector } from "./QuantitySelector";
import { convertINRToDiscountPercentage } from "@/utils/helper";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/context/TranslationContext";
import { ColorVariant, Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "wishlist";
  /** Force the card to be a plain link to the product page (no inline cart/wishlist actions) */
  hideActions?: boolean;
}

export function ProductCard({ product, variant = "default", hideActions: hideActionsProp = false }: ProductCardProps) {
  const pathname = usePathname();
  const from = pathname.startsWith("/collections")
    ? "collections"
    : pathname.startsWith("/categories")
    ? "categories"
    : pathname.startsWith("/new-arrivals")
    ? "new-arrivals"
    : null;

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Color variants are chosen on the product detail page, not on the card.
  const displayImage = product.images?.[0];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { t } = useTranslation();

  const effBasePrice = product.price;
  const effStock = product.stock;

  // Card add-to-cart uses the base line (no color); colors are picked on the detail page.
  const activeColorName = "";
  const cartItem = items.find((i) => i.id === product.id && !i.color);
  const isOutOfStock = effStock === 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isOutOfStock) {
      toast.error(t("shop.product.unavailable"));
      return;
    }
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: effBasePrice - (product.discount || 0),
      quantity: 1,
      image: displayImage || "",
      stock: effStock,
      color: "",
      colorHex: "",
    };
    addItem(item);
  };

  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const isWishlisted = wishlistItems.some((i) => i.id === product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = convertINRToDiscountPercentage(product.price, product.discount);
  const isLowStock = effStock > 0 && effStock < 5;
  const productHref = `/product/${product.id}${from ? `?from=${from}` : ""}`;

  // On the browse pages (new-arrivals, collections, categories) and anywhere the
  // caller opts in, the card is purely a link to the product detail page —
  // no inline cart/wishlist actions.
  const hideActions = hideActionsProp || !!from;

  return (
    <>
      {/* Outer wrapper is NOT a link — link is only on the visual card */}
      <div className={cn("group relative bg-transparent rounded-lg", isOutOfStock && "grayscale-[0.5]")}>

        {/* --- IMAGE AREA --- */}
        <div className="aspect-[3/4] overflow-hidden bg-secondary/30 relative rounded-lg">

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="bg-background/90 text-foreground px-6 py-3 text-[10px] uppercase tracking-[0.4em] font-bold border border-border shadow-2xl text-center whitespace-nowrap">
                {t("shop.product.outOfStock")}
              </div>
            </div>
          )}

          {/* Discount badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {discountPercentage && !isOutOfStock && (
              <span className="text-spaced-bold bg-success/90 text-white px-2 py-1">
                {discountPercentage}% {t("shop.product.off")}
              </span>
            )}
          </div>

          {/* Desktop hover overlay (hidden on mobile) */}
          {!isOutOfStock && !isMobile && !hideActions && (
            <div className="absolute bottom-4 left-0 w-full px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
              {!isAdmin && (
                cartItem ? (
                  <div className="flex-1" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                    <QuantitySelector
                      quantity={cartItem.quantity}
                      min={1}
                      max={effStock}
                      onUpdate={(qty) => qty === 0 ? removeItem(product.id, activeColorName) : updateQuantity(product.id, qty, activeColorName)}
                      className="w-full bg-background/90 backdrop-blur-sm border-none h-10"
                      size="sm"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground border-none backdrop-blur-sm uppercase text-[10px] tracking-widest h-10"
                  >
                    {t("shop.product.addToCart")}
                  </Button>
                )
              )}
              {variant !== "wishlist" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsQuickViewOpen(true); }}
                    className={cn(
                      "bg-background/90 border-none backdrop-blur-sm hover:text-primary h-10 w-10 rounded-full",
                      isAdmin && "flex-1 w-auto px-4 gap-2 text-spaced-bold"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    {isAdmin && t("shop.product.quickView")}
                  </Button>
                  {!isAdmin && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleWishlist}
                      className="bg-background/90 border-none backdrop-blur-sm h-10 w-10 rounded-full transition-colors"
                    >
                      <Heart className={cn("w-4 h-4 transition-all", isWishlisted ? "fill-primary text-primary scale-110" : "text-foreground")} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Image — always links to product detail page */}
          <div className={cn(
            "w-full h-full relative overflow-hidden transition-opacity duration-500",
            isOutOfStock ? "opacity-40" : "opacity-100"
          )}>
            <Link href={productHref} className="absolute inset-0 block">
              <div className="absolute inset-0 transition-all duration-700 ease-in-out group-hover:scale-110">
                {displayImage ? (
                  <Image src={displayImage} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted animate-pulse" />
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* --- PRODUCT INFO (links to product page) --- */}
        <Link href={productHref}>
          <div className={cn(
            "py-4 space-y-2 transition-opacity duration-500",
            isOutOfStock ? "opacity-50" : "opacity-100"
          )}>
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.rating && (
                <div className="flex items-center text-primary/80">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] ml-1 font-sans font-medium text-muted-foreground">{product.rating}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between flex-col gap-2 md:flex-row md:items-center md:gap-0">
              <div className="flex items-center gap-3">
                <span className="text-sm md:text-base font-bold">
                  ₹{(effBasePrice - (product.discount || 0)).toLocaleString()}
                </span>
                {(product.discount || 0) > 0 && (
                  <span className="text-xs text-muted-foreground line-through opacity-50">
                    ₹{effBasePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* --- MOBILE ACTION BAR (outside any Link, always visible) --- */}
        {isMobile && !isOutOfStock && !isAdmin && !hideActions && (
          <div className="flex gap-2 pb-2">
            {cartItem ? (
              <QuantitySelector
                quantity={cartItem.quantity}
                min={1}
                max={effStock}
                onUpdate={(qty) => qty === 0 ? removeItem(product.id, activeColorName) : updateQuantity(product.id, qty, activeColorName)}
                className="flex-1 bg-secondary/30 border-border/50 h-10"
                size="sm"
              />
            ) : (
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 h-10 uppercase tracking-widest text-[10px] border-border/50 gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {t("shop.product.addToCart")}
              </Button>
            )}
            {variant !== "wishlist" && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleWishlist}
                className={cn(
                  "h-10 w-10 border-border/50 transition-colors",
                  isWishlisted ? "border-primary/30 bg-primary/5" : ""
                )}
              >
                <Heart className={cn("w-4 h-4 transition-all", isWishlisted ? "fill-primary text-primary scale-110" : "")} />
              </Button>
            )}
          </div>
        )}
      </div>

      <QuickViewModal
        product={product}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </>
  );
}
