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
    <section className="py-10 pwa-section border-t border-border/50 bg-secondary/50">
      <Container>
        <SectionTitle
          title={t("home.newArrivals.title")}
          subtitle={t("home.newArrivals.subtitle")}
          align="center"
        />

        {isLoading ? (
          <ProductRowSkeleton width={220} count={6} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:max-w-6xl md:mx-auto pwa-grid-to-scroll">
              {newArrivals
                .slice(0, displayLimit)
                .map((product) => (
                  <ProductCard key={product.id} product={product} hideActions />
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