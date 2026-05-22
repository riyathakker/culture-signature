"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export default function NewArrivalsPage() {
  const { newArrivals, isLoading, fetchNewArrivals } = useProductStore();
  const { t } = useTranslation();
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

  const filtered = newArrivals
    .filter((p) => activeCategoryIds.length === 0 || activeCategoryIds.includes(String(p.category?.id ?? p.categoryId)))
    .filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "popularity") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    return 0;
  });

  return (
    <HomePageContainer
      label={[{ label: t("home.newArrivals.title") }]}
      heading={t("home.newArrivals.title")}
      description={t("home.newArrivals.description")}
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            showCategories
            activeCategoryIds={activeCategoryIds}
            onCategoryChange={setActiveCategoryIds}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div className="flex items-center gap-4">
              <FilterDrawer
                showCategories
                activeCategoryIds={activeCategoryIds}
                onCategoryChange={setActiveCategoryIds}
              />
              <p className="hidden sm:inline-block text-spaced-bold text-muted-foreground">
                {t("shop.showing").replace("{count}", sorted.length.toString())}
              </p>
            </div>
            <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {isLoading ? (
            <div className="grid-gallery">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <p className="muted-italic text-lg">{t("home.newArrivals.empty")}</p>
              {activeCategoryIds.length > 0 && (
                <button
                  onClick={() => setActiveCategoryIds([])}
                  className="text-primary underline text-sm uppercase tracking-widest font-bold cursor-pointer"
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
      </div>
    </HomePageContainer>
  );
}
