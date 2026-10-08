"use client";
import { ProductCard } from "@/components/common/ProductCard";
import { RevealItem } from "@/components/common/Reveal";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslation } from "@/context/TranslationContext";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { useSearchParams } from "next/navigation";

const DEFAULT_PRICE_MAX = 100000;

export default function ShopPage() {
  const { t } = useTranslation();
  const {
    shopProducts,
    shopTotal,
    shopHasMore,
    shopPriceMax,
    shopLoading,
    shopLoadingMore,
    loadShopProducts,
    loadMoreShopProducts,
  } = useProductStore();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, DEFAULT_PRICE_MAX]);
  const [sortBy, setSortBy] = useState("newest");

  // Price ceiling comes from the server (max price across the catalogue).
  const priceMax = shopPriceMax || DEFAULT_PRICE_MAX;
  // Clamp the upper thumb so it never exceeds the real max once it loads.
  const priceLow = priceRange[0];
  const priceHigh = Math.min(priceRange[1], priceMax);

  // The filters sent to the API. An untouched upper thumb (>= priceMax) means
  // "no upper bound", so we leave maxPrice out in that case.
  const filters = {
    categoryIds: activeCategoryIds,
    search: searchQuery,
    minPrice: priceLow > 0 ? priceLow : undefined,
    maxPrice: priceHigh < priceMax ? priceHigh : undefined,
    inStock: inStockOnly,
    hasDiscount: hasDiscountOnly,
    sort: sortBy,
  };

  // Reload page 1 whenever the filters change (and on first mount). The JSON
  // key keeps this from firing on every render.
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    loadShopProducts(JSON.parse(filtersKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  // Infinite scroll: load the next page when the sentinel nears the viewport.
  const sentinelRef = useInfiniteScroll(shopHasMore, shopProducts.length, loadMoreShopProducts);

  const sharedFilterProps = {
    showCategories: true,
    activeCategoryIds,
    onCategoryChange: setActiveCategoryIds,
    inStockOnly,
    onInStockChange: setInStockOnly,
    hasDiscountOnly,
    onHasDiscountChange: setHasDiscountOnly,
    priceRange: [priceLow, priceHigh] as [number, number],
    onPriceChange: setPriceRange,
    maxPrice: priceMax,
    filteredCount: shopTotal,
  };

  const clearFilters = () => {
    setActiveCategoryIds([]);
    setInStockOnly(false);
    setHasDiscountOnly(false);
    setPriceRange([0, priceMax]);
  };

  return (
    <HomePageContainer
      label={[{ label: t("shop.subtitle") }]}
      heading={searchQuery.trim() ? t("shop.resultsFor", { query: searchQuery }) : t("shop.title")}
      description={searchQuery.trim() ? t("shop.itemsFound", { count: shopTotal }) : t("shop.description")}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3 border-b pb-4 lg:pb-6  ">
          <div className="flex items-center gap-3">
            <FilterDrawer {...sharedFilterProps} />
            <p className="hidden sm:inline-block text-spaced-bold text-muted-foreground whitespace-nowrap">
              {t("shop.showing").replace("{count}", shopTotal.toString())}
            </p>
          </div>
          <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        <ActiveFilterChips
          categoryIds={activeCategoryIds}
          onCategoryChange={setActiveCategoryIds}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          hasDiscountOnly={hasDiscountOnly}
          onHasDiscountChange={setHasDiscountOnly}
          priceRange={[priceLow, priceHigh]}
          onPriceChange={setPriceRange}
          maxPrice={priceMax}
        />

        {shopLoading ? (
          <div className="grid-gallery">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : shopProducts.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <p className="muted-italic text-lg">{t("shop.noMatches")}</p>
            <button onClick={clearFilters} className="btn-luxury-outline cursor-pointer">
              {t("shop.clearFilters")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid-gallery">
              {shopProducts.map((product, i) => (
                <RevealItem key={product.id} index={i}>
                  <ProductCard product={product} hideActions={false} />
                </RevealItem>
              ))}
            </div>

            {/* Infinite-scroll sentinel + loading indicator */}
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
