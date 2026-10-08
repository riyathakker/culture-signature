"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { RevealItem } from "@/components/common/Reveal";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslation } from "@/context/TranslationContext";

export default function CategoryPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    shopProducts,
    shopTotal,
    shopHasMore,
    shopLoading,
    shopLoadingMore,
    loadShopProducts,
    loadMoreShopProducts,
  } = useProductStore();

  const [sortBy, setSortBy] = useState("newest");
  const searchParams = useSearchParams();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  const category = categories.find((c) => c.id === id) ?? null;

  // Filters sent to the paginated API for this category.
  const filters = {
    categoryIds: id ? [id as string] : [],
    minPrice,
    maxPrice,
    sort: sortBy,
  };

  // Reload page 1 whenever the category, sort, or price range changes.
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    if (!id) return;
    loadShopProducts(JSON.parse(filtersKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  const sentinelRef = useInfiniteScroll(shopHasMore, shopProducts.length, loadMoreShopProducts);

  return (
    <HomePageContainer
      label={[{ label: t("nav.links.categories"), href: ROUTES.CATEGORIES }, { label: category?.name ?? "" }]}
    >
      <div className="space-y-8">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-muted-foreground/10 pb-6">
          <div className="flex items-center gap-4 flex-row">
            <FilterDrawer />
            <p className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              {t("shop.showing").replace("{count}", shopTotal.toString())}
            </p>
          </div>
          <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {shopLoading ? (
          <div className="grid-gallery">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : shopProducts.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-serif italic text-muted-foreground">?</span>
            </div>
            <p className="muted-italic text-xl">{t("shop.categoryEmpty")}</p>
            <button
              onClick={() => window.location.href = "/collections"}
              className="text-primary hover:text-primary/70 transition-colors text-sm uppercase tracking-[0.2em] font-bold border-b border-primary/30 pb-1 cursor-pointer"
            >
              {t("shop.exploreAll")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid-gallery gap-x-8 gap-y-12">
              {shopProducts.map((product, i) => (
                <RevealItem key={product.id} index={i}>
                  <ProductCard product={product} />
                </RevealItem>
              ))}
            </div>

            {shopHasMore && (
              <div ref={sentinelRef} className="flex justify-center py-10">
                {shopLoadingMore && (
                  <span className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </HomePageContainer>
  );
}
