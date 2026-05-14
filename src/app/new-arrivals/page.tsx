"use client";

import { ProductCard } from "@/components/ui/ProductCard";
import { useEffect } from "react";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { HomePageContainer } from "@/components/common/HomePageContainer";

import { en } from "@/locales/en";

export default function NewArrivalsPage() {
  const { newArrivals, isLoading, fetchNewArrivals } = useProductStore();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  return (
    <HomePageContainer 
      label={[{ label: en.home.newArrivals.title }]} 
      heading={en.home.newArrivals.title} 
      description={en.home.newArrivals.description}
    >

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : newArrivals.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-serif italic text-lg">{en.home.newArrivals.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-700">
          {newArrivals.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
