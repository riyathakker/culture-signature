"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";

import { useProductStore } from "@/store/productStore";

import { useTranslation } from "@/context/TranslationContext";
import { Product } from "@/types";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function FeaturedProducts() {
  const {
    fetchFeaturedProducts,
    featuredProducts,
    isLoading,
  } = useProductStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);



  if (!isLoading && (!featuredProducts || featuredProducts.length === 0)) {
    return null;
  }

  return (
    <section className="py-10 pwa-section bg-secondary/50 border-t border-border/50">
      <Container>
        <SectionTitle
          title={t("home.featured.title")}
          subtitle={t("home.featured.subtitle")}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: "touch" }}>
              {featuredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="min-w-[160px] max-w-[160px] flex-shrink-0"
                >
                  <ProductCard product={product} hideActions />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <Link
                href={ROUTES.COLLECTIONS}
                className="btn-luxury-outline"
              >
                {t("home.featured.viewCollection")}
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}