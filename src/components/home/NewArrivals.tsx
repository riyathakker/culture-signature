"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { en } from "@/locales/en";

export function NewArrivals() {
  const { fetchNewArrivals, newArrivals, isLoading } = useProductStore()

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const formatProduct = (product: any) => ({
    ...product,
    name: product.title,
    image: product.images?.[0] || "/placeholder.jpg",
    category: product.category?.name || "Uncategorized",
  });

  return (
    <section className="pt-12 pb-16 bg-secondary/10">
      <Container>
        <SectionTitle title={en.home.newArrivals.title} subtitle={en.home.newArrivals.subtitle} align="center" />
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={formatProduct(product)} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
