"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { FilterDraft } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ActiveFilterChips } from "@/components/shop/ActiveFilterChips";
import { ShopControls } from "@/components/shop/ShopControls";
import { useEffect, useState, useMemo } from "react";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { useTranslation } from "@/context/TranslationContext";

export default function NewArrivalsPage() {
  const { newArrivals, isLoading, fetchNewArrivals } = useProductStore();
  const { t } = useTranslation();
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const priceMax = useMemo(
    () => newArrivals.length ? Math.ceil(Math.max(...newArrivals.map((p) => p.price)) / 1000) * 1000 : 100000,
    [newArrivals]
  );
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const matchesFilters = (p: (typeof newArrivals)[number], f: FilterDraft) => {
    if (f.categoryIds.length > 0 && !f.categoryIds.includes(String(p.category?.id ?? p.categoryId))) return false;
    if (!(Number(p.price) >= f.price[0] && (f.price[1] >= priceMax || Number(p.price) <= f.price[1]))) return false;
    if (f.inStock && !(p.stock > 0)) return false;
    if (f.discount && !(p.discount && p.discount > 0)) return false;
    return true;
  };

  const filtered = newArrivals.filter((p) =>
    matchesFilters(p, { categoryIds: activeCategoryIds, inStock: inStockOnly, discount: hasDiscountOnly, price: priceRange })
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "popularity") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    return 0;
  });

  const sharedFilterProps = {
    showCategories: true,
    activeCategoryIds,
    onCategoryChange: setActiveCategoryIds,
    inStockOnly,
    onInStockChange: setInStockOnly,
    hasDiscountOnly,
    onHasDiscountChange: setHasDiscountOnly,
    priceRange,
    onPriceChange: setPriceRange,
    maxPrice: priceMax,
    filteredCount: sorted.length,
    getFilteredCount: (draft: FilterDraft) => newArrivals.filter((p) => matchesFilters(p, draft)).length,
  };

  return (
    <HomePageContainer
      label={[{ label: t("home.newArrivals.title") }]}
      heading={t("home.newArrivals.title")}
      description={t("home.newArrivals.description")}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3 border-b pb-6">
          <div className="flex items-center gap-3">
            <FilterDrawer {...sharedFilterProps} />
            <p className="hidden sm:inline-block text-spaced-bold text-muted-foreground whitespace-nowrap">
              {t("shop.showing").replace("{count}", sorted.length.toString())}
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
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          maxPrice={priceMax}
        />

        {isLoading ? (
          <div className="grid-gallery">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <p className="muted-italic text-lg">{t("home.newArrivals.empty")}</p>
            {(activeCategoryIds.length > 0 || inStockOnly || hasDiscountOnly || priceRange[0] > 0 || priceRange[1] < priceMax) && (
              <button
                onClick={() => {
                  setActiveCategoryIds([]);
                  setInStockOnly(false);
                  setHasDiscountOnly(false);
                  setPriceRange([0, priceMax]);
                }}
                className="btn-luxury-outline cursor-pointer"
              >
                {t("shop.clearFilters")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid-gallery animate-in fade-in duration-700">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </HomePageContainer>
  );
}
