"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { useTranslation } from "@/context/TranslationContext";

export function NewArrivals() {
  const { fetchNewArrivals, newArrivals, isLoading } = useProductStore()
  const { t } = useTranslation();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  if (!isLoading && (!newArrivals || newArrivals.length === 0)) {
    return null;
  }

  return (
    <section className="py-24 border-t border-border/50">
      <Container>
        <SectionTitle title={t("home.newArrivals.title")} subtitle={t("home.newArrivals.subtitle")} align="center" />
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
