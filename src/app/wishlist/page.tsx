"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items, fetchWishlist } = useWishlistStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (session?.user) fetchWishlist();
  }, [session?.user]);

  return (
    <HomePageContainer label={[{ label: t("wishlist.breadcrumb") }]} heading={t("wishlist.heading")} description={t("wishlist.description")}>
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={t("wishlist.emptyTitle")}
          description={t("wishlist.emptyDescription")}
          action={{ label: t("wishlist.explore"), href: ROUTES.COLLECTIONS }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-700">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} variant="wishlist" />
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
