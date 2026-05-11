"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { en } from "@/locales/en";

export function FeaturedProducts() {
  const { fetchFeaturedProducts, featuredProducts, isLoading } = useProductStore()
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const formatProduct = (product: any) => ({
    ...product,
    name: product.title,
    image: product.images?.[0] || "/placeholder.jpg",
    category: product.category?.name || "Uncategorized",
  });

  return (
    <section className="bg-secondary/20 pt-12">
      <Container>
        <SectionTitle title={en.home.featured.title} subtitle={en.home.featured.subtitle} />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={formatProduct(product)} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
