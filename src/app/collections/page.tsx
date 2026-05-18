"use client";

import { HomePageContainer } from "@/components/common/HomePageContainer";
import { CommonLoader } from "@/components/common/Loader";
import { useCategoryStore } from "@/store/categoryStore";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { useTranslation } from "@/context/TranslationContext";

export default function CollectionsPage() {
  const { categories, isLoading, fetchCategories } = useCategoryStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <HomePageContainer 
      label={[{ label: t("collections.subtitle") }]} 
      heading={t("collections.title")} 
      description={t("collections.description")}
    >
      {isLoading ? (
        <CommonLoader />
      ) : categories.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-serif italic text-lg">{t("collections.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?categoryId=${category.id}`}
              className="group block"
            >
              <div className="aspect-[4/5] bg-secondary/30 relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-luxury-gradient opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                  <div className="bg-background/90 backdrop-blur-md px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold">
                    {t("shop.product.viewCollection")}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-3xl font-heading group-hover:text-primary transition-colors">{category.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">{category._count?.products || 0} {t("home.categories.pieces")}</span>
                </div>
                <p className="text-muted-foreground font-serif italic text-sm leading-relaxed max-w-xs">
                  Curated selection of artisanal {category.name.toLowerCase()} masterpieces.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary group-hover:gap-4 transition-all">
                  {t("cart.page.browseCollection")} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
