"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Truck, ShieldCheck, Bell, BellRing } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/context/TranslationContext";
import { ShareDialog } from "./ShareDialog";
import { QuantitySelector } from "../common/QuantitySelector";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    category: string;
    description: string;
    images: string[];
    stock: number;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [notified, setNotified] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`stock_notify_${product.id}`) === "1";
  });
  const { t } = useTranslation();
  const router = useRouter();

  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info(`Removed from wishlist`);
    } else {
      addToWishlist(product as any);
      toast.success(`Added to wishlist`);
    }
  };

  const buildCartItem = (): CartItem => ({
    id: product.id,
    name: product.name,
    price: product.price - (product.discount || 0),
    quantity,
    image: product.images[0],
    stock: product.stock,
  });

  const handleAddToCart = () => {
    if (quantity < 1) return;
    addItem(buildCartItem());
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (quantity < 1) return;
    addItem(buildCartItem());
    setQuantity(1);
    router.push(ROUTES.SHOPPING_BAG);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-luxury italic opacity-60 uppercase">{product.category || t("shop.product.defaultCollection")}</p>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("w-5 h-5 transition-all", isWishlisted ? "fill-primary text-primary scale-110" : "")} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShareOpen(true)}
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading tracking-tight">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-3xl font-medium">₹{(product.price - (product.discount || 0)).toLocaleString()}</span>
        {product.discount > 0 && (
          <span className="text-xl text-muted-foreground line-through opacity-50">₹{product.price.toLocaleString()}</span>
        )}
      </div>

      <p className="muted-italic text-lg leading-relaxed">
        {product.description}
      </p>

      {!isAdmin && (
        <div className="space-y-4 pt-6">
          {product.stock === 0 ? (
            <Button
              onClick={() => {
                if (notified) return;
                localStorage.setItem(`stock_notify_${product.id}`, "1");
                setNotified(true);
                toast.success("We'll notify you when this piece is back in stock.");
              }}
              variant="outline"
              className="w-full h-14 uppercase tracking-[0.2em] text-xs border-primary gap-2"
              disabled={notified}
            >
              {notified ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {notified ? "You'll be notified" : "Notify me when available"}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <QuantitySelector
                  onUpdate={setQuantity}
                  quantity={quantity}
                  min={1}
                  max={product.stock}
                  className="flex items-center border rounded-sm h-14 w-[40%]"
                />
                <Button onClick={handleAddToCart} className="flex-1 h-14 uppercase tracking-[0.2em] text-xs">
                  {t("shop.product.details.addToCollection")}
                </Button>
              </div>
              <Button onClick={handleBuyNow} variant="outline" className="w-full h-14 uppercase tracking-[0.2em] text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t("shop.product.details.buyNow")}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 pt-8 border-t">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
          <Truck className="w-5 h-5 text-primary opacity-60" />
          <span>{t("shop.product.details.premiumShipping")}</span>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
          <ShieldCheck className="w-5 h-5 text-primary opacity-60" />
          <span>{t("shop.product.details.lifetimeWarranty")}</span>
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        productName={product.name}
        productImage={product.images?.[0]}
      />
    </div>
  );
}
