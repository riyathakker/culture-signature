"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { ROUTES } from "@/constants/routes";

export function Collections() {
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const preview = featuredProducts.slice(0, 4);

  if (!isLoading && preview.length === 0) return null;

  return (
    <section className="py-20 border-t border-border/50">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionTitle
            title="The Collection"
            subtitle="Curated pieces from our permanent archive"
            align="left"
            className="mb-0"
          />
          <Link
            href={ROUTES.COLLECTIONS}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-primary hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {preview.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
