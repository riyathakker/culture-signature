"use client";

import { useCartStore, cartLineKey } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { CartSkeleton } from "@/components/account/AccountSkeletons";
import { toast } from "sonner";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export default function BagPage() {
  const { items, clearCart, isLoading } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();
  const { t } = useTranslation();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleMoveAllToWishlist = async () => {
    for (const item of items) {
      if (!isInWishlist(item.id)) {
        await addToWishlist({
          id: item.id,
          name: item.name,
          price: item.price,
          discount: 0,
          stock: item.stock,
          images: [item.image],
          categoryId: "",
          category: { id: "", name: "", description: null, createdAt: new Date() },
          isFeatured: false,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          description: null,
          reviews: [],
        });
      }
    }
    await clearCart();
    toast.success(t("cart.page.movedToWishlist"));
  };

  return (
    <HomePageContainer
      label={[{ label: t("cart.page.title") }]}
      heading={t("cart.page.title")}
      description={t("cart.page.description")}
    >
      {isLoading && items.length === 0 ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t("cart.page.emptyTitle")}
          description={t("cart.page.emptyDescription")}
          action={{ label: t("cart.page.browseCollection"), href: ROUTES.COLLECTIONS }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="pt-8 flex flex-row items-center justify-between gap-4">
              <Link href={ROUTES.COLLECTIONS} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" /> {t("cart.page.continueShopping")}
              </Link>
              <Button variant="ghost" onClick={handleMoveAllToWishlist} className="gap-2 text-spaced-bold font-bold text-muted-foreground text-[10px] shrink-0">
                <Heart className="w-4 h-4" /> {t("cart.page.moveToWishlist")}
              </Button>
            </div>
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItem key={cartLineKey(item.id, item.color)} item={item} variant="page" />
              ))}
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
