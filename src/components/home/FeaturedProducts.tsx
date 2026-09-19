"use client";

import { useEffect } from "react";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductRowSkeleton } from "@/components/home/HomeSkeletons";

import { useProductStore } from "@/store/productStore";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

const DISPLAY_LIMIT = 8;

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
    <section className="py-8 pwa-section border-t border-border/50 bg-accent/30">
      <Container>
        <SectionTitle
          title={t("home.featured.title")}
          subtitle={t("home.featured.subtitle")}
        />

        {isLoading ? (
          <ProductRowSkeleton width={220} count={6} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:max-w-6xl md:mx-auto pwa-grid-to-scroll">
              {featuredProducts
                .slice(0, DISPLAY_LIMIT)
                .map((product) => (
                  <ProductCard key={product.id} product={product} hideActions />
                ))}
            </div>
            <div className="flex justify-center mt-6">
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
