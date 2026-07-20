"use client";
import { ProductCard } from "@/components/common/ProductCard";
import { FilterSidebar, FilterDraft } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/productStore";
import { useTranslation } from "@/context/TranslationContext";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const { t } = useTranslation();
  const { allUserProducts: products, isLoading: loading, fetchAllUserProducts } = useProductStore();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchAllUserProducts();
  }, []);

  const priceMax = useMemo(
    () => products.length ? Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000 : 100000,
    [products]
  );

  const matchesFilters = (p: (typeof products)[number], f: FilterDraft) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inSearch = p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category?.name ?? "").toLowerCase().includes(q);
      if (!inSearch) return false;
    }
    if (f.categoryIds.length > 0 && !f.categoryIds.includes(String(p.categoryId ?? p.category?.id))) return false;
    if (!(Number(p.price) >= f.price[0] && (f.price[1] >= priceMax || Number(p.price) <= f.price[1]))) return false;
    if (f.inStock && !(p.stock > 0)) return false;
    if (f.discount && !(p.discount && p.discount > 0)) return false;
    return true;
  };

  const filtered = products.filter((p) =>
    matchesFilters(p, { categoryIds: activeCategoryIds, inStock: inStockOnly, discount: hasDiscountOnly, price: priceRange })
  );

  const sortedProducts = [...filtered].sort((a, b) => {
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
    filteredCount: sortedProducts.length,
    getFilteredCount: (draft: FilterDraft) => products.filter((p) => matchesFilters(p, draft)).length,
  };

  return (
    <HomePageContainer
      label={[{ label: t("shop.subtitle") }]}
      heading={searchQuery.trim() ? `Results for "${searchQuery}"` : t("shop.title")}
      description={searchQuery.trim() ? `${sortedProducts.length} item${sortedProducts.length !== 1 ? "s" : ""} found` : t("shop.description")}
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar {...sharedFilterProps} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between gap-3 border-b pb-6">
            <div className="flex items-center gap-3">
              <FilterDrawer {...sharedFilterProps} />
              <p className="hidden sm:inline-block text-spaced-bold text-muted-foreground whitespace-nowrap">
                {t("shop.showing").replace("{count}", sortedProducts.length.toString())}
              </p>
            </div>
            <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {loading ? (
            <div className="grid-gallery">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <p className="muted-italic text-lg">{t("shop.noMatches")}</p>
              <button
                onClick={() => {
                  setActiveCategoryIds([]);
                  setInStockOnly(false);
                  setHasDiscountOnly(false);
                  setPriceRange([0, priceMax]);
                }}
                className="text-primary underline text-sm uppercase tracking-widest font-bold cursor-pointer"
              >
                {t("shop.clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid-gallery animate-in fade-in duration-700">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </HomePageContainer>
  );
}
