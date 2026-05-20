"use client";

import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomePageContainer } from "@/components/common/HomePageContainer";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export default function BagPage() {
  const { items } = useCartStore();
  const { t } = useTranslation();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HomePageContainer
      label={[{ label: t("cart.page.title") }]}
      heading={t("cart.page.title")}
      description={t("cart.page.description")}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center relative">
            <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-30" />
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-heading">{t("cart.page.emptyTitle")}</h3>
            <p className="muted-italic max-w-sm mx-auto">
              {t("cart.page.emptyDescription")}
            </p>
          </div>
          <Link href={ROUTES.COLLECTIONS}>
            <Button className="px-10 py-7 h-auto uppercase tracking-[0.3em] text-xs">
              {t("cart.page.browseCollection")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex  border-b pb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                {t("cart.page.selection").replace("{count}", itemCount.toString())}
              </span>
            </div>
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItem key={item.id} item={item} variant="page" />
              ))}
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link href={ROUTES.COLLECTIONS} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("cart.page.continueShopping")}
              </Link>
              <div className="flex items-center gap-4">
                <Link href={ROUTES.WISHLIST}>
                  <Button variant="ghost" className="gap-2 text-spaced-bold font-bold text-muted-foreground">
                    <Heart className="w-4 h-4" /> {t("cart.page.moveToWishlist")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </HomePageContainer>
  );
}
