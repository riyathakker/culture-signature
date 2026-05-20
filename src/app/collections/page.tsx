"use client";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useTranslation } from "@/context/TranslationContext";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function ShopPage() {
  const { t } = useTranslation();
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = activeCategoryIds.length > 0
          ? `/api/products?categoryId=${activeCategoryIds.join(",")}`
          : "/api/products";
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategoryIds]);

  const searchParams = useSearchParams();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

  const filteredProducts = products.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "popularity") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    return 0;
  });

  return (
    <HomePageContainer
      label={[{ label: t("shop.subtitle") }]}
      heading={t("shop.title")}
      description={t("shop.description")}
    >

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar showCategories
            activeCategoryIds={activeCategoryIds}
            onCategoryChange={setActiveCategoryIds}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div className="flex items-center gap-4">
              <FilterDrawer showCategories
                activeCategoryIds={activeCategoryIds}
                onCategoryChange={setActiveCategoryIds} />
              <p className="text-spaced-bold text-muted-foreground">
                {t("shop.showing").replace("{count}", products.length.toString())}
              </p>
            </div>
            <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {true ? (
            <div className="grid-gallery">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <p className="muted-italic text-lg">{t("shop.noMatches")}</p>
              <button
                onClick={() => window.location.href = "/shop"}
                className="text-primary underline text-sm uppercase tracking-widest font-bold cursor-pointer"
              >
                {t("shop.clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid-gallery  animate-in fade-in duration-700">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="pt-20 flex justify-center">
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-primary bg-primary text-primary-foreground font-bold text-xs">1</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </HomePageContainer>
  );
}
