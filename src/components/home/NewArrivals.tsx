"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";

import { useProductStore } from "@/store/productStore";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";
import { usePWA } from "@/hooks/usePWA";
import { useIsMobile } from "@/hooks/useIsMobile";

export function NewArrivals() {
  const {
    fetchNewArrivals,
    newArrivals,
    isLoading,
  } = useProductStore();

  const { t } = useTranslation();
  const isPWA = usePWA();
  const isMobile = useIsMobile();
  const displayLimit = isMobile && !isPWA ? 4 : 8;

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  if (!isLoading && (!newArrivals || newArrivals.length === 0)) {
    return null;
  }

  return (
    <section className="py-10 pwa-section border-t border-border/50">
      <Container>
        <SectionTitle
          title={t("home.newArrivals.title")}
          subtitle={t("home.newArrivals.subtitle")}
          align="center"
        />

        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[220px] max-w-[220px] flex-shrink-0">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Single horizontal row (smaller cards, like Limited Drops) */}
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {newArrivals
                .slice(0, displayLimit)
                .map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[220px] max-w-[220px] flex-shrink-0"
                  >
                    <ProductCard product={product} hideActions />
                  </div>
                ))}
            </div>
            {newArrivals.length > displayLimit && (
              <div className="flex justify-center mt-4">
                <Link
                  href={ROUTES.NEW_ARRIVALS}
                  className="btn-luxury-outline"
                >
                  {t("home.newArrivals.viewMore")}
                </Link>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}