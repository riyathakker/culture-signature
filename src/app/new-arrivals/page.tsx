"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { useEffect } from "react";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useProductStore } from "@/store/productStore";
import { HomePageContainer } from "@/components/common/HomePageContainer";

import { useTranslation } from "@/context/TranslationContext";

export default function NewArrivalsPage() {
  const { newArrivals, isLoading, fetchNewArrivals } = useProductStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  return (
    <HomePageContainer
      label={[{ label: t("home.newArrivals.title") }]}
      heading={t("home.newArrivals.title")}
      description={t("home.newArrivals.description")}
    >

      {isLoading ? (
        <div className="grid-gallery">
          {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : newArrivals.length === 0 ? (
        <div className="py-20 text-center">
          <p className="muted-italic text-lg">{t("home.newArrivals.empty")}</p>
        </div>
      ) : (
        <div className="grid-gallery animate-in fade-in duration-700">
          {newArrivals.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
