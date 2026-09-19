"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export default function AccountWishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const { items, isLoading, fetchWishlist } = useWishlistStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (status === "unauthenticated") { router.push(ROUTES.HOME); return; }
    if (status === "authenticated") fetchWishlist();
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t("account.wishlist.emptyTitle")}
          description={t("account.wishlist.emptyDescription")}
          action={{ label: t("account.wishlist.exploreCollection"), href: ROUTES.COLLECTIONS }}
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} variant="wishlist" />
          ))}
        </div>
      )}
    </div>
  );
}
