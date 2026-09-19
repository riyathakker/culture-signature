"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";
import type { Product, Category } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() || "";
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!q) {
        setProducts([]);
        setCategories([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=48`);
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <HomePageContainer label={[{ label: t("search.heading") }]}>
      <div className="space-y-8">
        <div className="border-b border-muted-foreground/10 pb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            {q ? t("search.resultsFor").replace("{query}", q) : t("search.heading")}
          </p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="px-4 py-2 rounded-full border border-muted-foreground/20 text-sm hover:border-primary hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid-gallery">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 text-center space-y-6">
            <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-serif italic text-muted-foreground">?</span>
            </div>
            <p className="muted-italic text-xl">{t("search.emptyTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("search.emptyDescription")}</p>
            <Link
              href={ROUTES.COLLECTIONS}
              className="inline-block text-primary hover:text-primary/70 transition-colors text-sm uppercase tracking-[0.2em] font-bold border-b border-primary/30 pb-1"
            >
              {t("shop.exploreAll")}
            </Link>
          </div>
        ) : (
          <div className="grid-gallery gap-x-8 gap-y-12 animate-in fade-in duration-1000">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </HomePageContainer>
  );
}
