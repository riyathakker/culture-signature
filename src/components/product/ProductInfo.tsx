"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, Truck, ShieldCheck, Bell, BellRing } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import { swatchStyle } from "@/lib/colorVariant";
import { Button } from "@/components/ui/button";
import { useCartStore, CartItem } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/context/TranslationContext";
import { ShareDialog } from "./ShareDialog";
import { QuantitySelector } from "../common/QuantitySelector";
import { PincodeChecker } from "./PincodeChecker";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { ColorVariant } from "@/types";
import { convertINRToDiscountPercentage } from "@/utils/helper";

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
    colors?: ColorVariant[] | null;
  };
  onColorChange?: (images: string[]) => void;
}

export function ProductInfo({ product, onColorChange }: ProductInfoProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const colors = product.colors ?? [];
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(colors.length > 0 ? colors[0] : null);
  const [notified, setNotified] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`stock_notify_${product.id}`) === "1";
  });
  const { t } = useTranslation();
  const router = useRouter();

  const { data: session, status } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const { addItem, items, updateQuantity, removeItem } = useCartStore();

  // Price/stock come from the base product; only the image is color-specific.
  const activeColorName = activeColor?.name || "";
  const effBasePrice = product.price;
  const effStock = product.stock;
  const effImage = activeColor?.images?.[0] || product.images[0];
  const effNetPrice = effBasePrice - (product.discount || 0);

  const cartItem = items.find(
    (i) => i.id === product.id && (i.color || "") === activeColorName
  );
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product as any);
    }
  };

  const buildCartItem = (): CartItem => ({
    id: product.id,
    name: product.name,
    price: effNetPrice,
    quantity: 1,
    image: effImage,
    stock: effStock,
    color: activeColorName,
    colorHex: activeColor?.hex || "",
  });

  const handleAddToCart = () => {
    addItem(buildCartItem());
  };

  const handleBuyNow = () => {
    if (!cartItem) addItem(buildCartItem());
    router.push(ROUTES.SHOPPING_BAG);
  };
  const isOutOfStock = effStock === 0;
  const discountPercentage = convertINRToDiscountPercentage(product.price, product.discount);
  return (
    <div className="space-y-4 flex-1">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-luxury italic opacity-60 uppercase">{product.category || t("shop.product.defaultCollection")}</p>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleWishlist}
                aria-label={isWishlisted ? t("shop.product.details.removeFromWishlist") : t("shop.product.details.addToWishlist")}
              >
                <Heart className={cn("w-5 h-5 transition-all", isWishlisted ? "fill-primary text-primary scale-110" : "")} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShareOpen(true)}
              aria-label={t("shop.product.details.shareAria")}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <h1 className="text-2xl lg:text-3xl font-heading tracking-tight">{product.name}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-medium">₹{effNetPrice.toLocaleString()}</span>
        {product.discount > 0 && (
          <span className="text-base text-muted-foreground line-through opacity-50">₹{effBasePrice.toLocaleString()}</span>
        )}
        {discountPercentage && !isOutOfStock && (
          <span className="text-spaced-bold bg-success/90 text-white px-2 py-1">
            {discountPercentage}% {t("shop.product.off")}
          </span>
        )}
      </div>

      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("shop.product.details.color")}: <span className="text-foreground font-bold">{activeColor?.name || ""}</span>
            {activeColor && effStock > 0 && effStock <= 5 && (
              <span className="ml-2 text-primary/70 normal-case tracking-normal">{t("shop.product.details.onlyLeft", { count: effStock })}</span>
            )}
            {activeColor && effStock === 0 && (
              <span className="ml-2 text-destructive normal-case tracking-normal">{t("shop.product.details.soldOut")}</span>
            )}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {colors.map((c, i) => {
              const soldOut = c.stock != null && Number(c.stock) === 0;
              const isActive = activeColor === c;
              return (
                <button
                  key={i}
                  type="button"
                  title={soldOut ? `${c.name} — ${t("shop.product.details.soldOut")}` : c.name}
                  onClick={() => {
                    setActiveColor(c);
                    onColorChange?.(c.images ?? []);
                  }}
                  className={cn(
                    "relative w-7 h-7 rounded-full border-2 transition-all",
                    isActive
                      ? "border-foreground scale-110 shadow-md"
                      : "border-transparent hover:border-foreground/40",
                    soldOut && "opacity-40"
                  )}
                  style={swatchStyle(c.hex, c.hex2)}
                >
                  {soldOut && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-px bg-foreground rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="muted-italic text-base leading-relaxed">
        {product.description}
      </p>

      {!isAdmin && (
        <div className="pt-3 mb-2">
          {effStock === 0 ? (
            <Button
              onClick={() => {
                if (notified) return;
                localStorage.setItem(`stock_notify_${product.id}`, "1");
                setNotified(true);
                toast.success(t("shop.product.details.notify.success"));
              }}
              variant="outline"
              className="w-full h-12 uppercase tracking-[0.2em] text-xs border-primary gap-2"
              disabled={notified}
            >
              {notified ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {notified ? t("shop.product.details.notify.notified") : t("shop.product.details.notify.notifyMe")}
            </Button>
          ) : (
            <div className="flex gap-3">
              {cartItem ? (
                <QuantitySelector
                  quantity={cartItem.quantity}
                  min={0}
                  max={effStock}
                  onUpdate={(qty) => qty === 0 ? removeItem(product.id, activeColorName) : updateQuantity(product.id, qty, activeColorName)}
                  className="flex-1 h-12 border rounded-sm"
                />
              ) : (
                <Button onClick={handleAddToCart} className="flex-1 h-12 uppercase tracking-[0.2em] text-xs">
                  {t("shop.product.details.addToCollection")}
                </Button>
              )}
              <Button onClick={handleBuyNow} variant="outline" className="flex-1 h-12 uppercase tracking-[0.2em] text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t("shop.product.details.buyNow")}
              </Button>
            </div>
          )}
        </div>
      )}

      {!isAdmin && <PincodeChecker />}


      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        productName={product.name}
        productImage={product.images?.[0]}
      />
    </div>
  );
}
