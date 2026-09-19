"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useCategoryStore } from "@/store/categoryStore";
import { useTranslation } from "@/context/TranslationContext";
import type { Product, Category } from "@/types";

export default function CategoryPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCategories();
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentCat = categories.find((c) => c.id === id) ?? null;
        setCategory(currentCat);

        const prodRes = await fetch(`/api/products?categoryId=${id}`);
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const data = await prodRes.json();
        setProducts(data);
      } catch (error) {
        console.error("[CategoryPage]", error);
        toast.error(t("shop.loadCollectionError"));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

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
      label={[{ label: t("nav.links.categories"), href: ROUTES.CATEGORIES }, { label: category?.name ?? "" }]}
    >
      <div className="space-y-8">
        <div className="flex flex-row justify-between items-center gap-3 border-b border-muted-foreground/10 pb-6">
          <div className="flex items-center gap-4 flex-row">
            <FilterDrawer />
            <p className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              {t("shop.showing").replace("{count}", products.length.toString())}
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
        ) : products.length === 0 ? (
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
          <div className="grid-gallery gap-x-8 gap-y-12 animate-in fade-in duration-1000">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </HomePageContainer>
  );
}
