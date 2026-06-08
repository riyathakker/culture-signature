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

export function NewArrivals() {
  const {
    fetchNewArrivals,
    newArrivals,
    isLoading,
  } = useProductStore();

  const { t } = useTranslation();

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  if (!isLoading && (!newArrivals || newArrivals.length === 0)) {
    return null;
  }

  return (
    <section className="py-10 md:py-18 pwa-section border-t border-border/50">
      <Container>
        <SectionTitle
          title={t("home.newArrivals.title")}
          subtitle={t("home.newArrivals.subtitle")}
          align="center"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pwa-grid-to-scroll">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pwa-grid-to-scroll">
              {newArrivals
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hideActions
                  />
                ))}
            </div>
            {newArrivals.length > 4 && (
              <div className="flex justify-center mt-2 md:mt-6">
                <Link
                  href={ROUTES.NEW_ARRIVALS}
                  className="
                  px-8
                  py-3
                  border
                  border-primary
                  text-primary
                  uppercase
                  tracking-[0.2em]
                  text-sm
                  transition-all
                  duration-300
                  hover:bg-primary
                  hover:text-white
                "
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