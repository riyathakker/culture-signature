"use client";

import { HomePageContainer } from "@/components/common/HomePageContainer";
import { CommonLoader } from "@/components/common/Loader";
import { useCategoryStore } from "@/store/categoryStore";
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
          <p className="muted-italic text-lg">{t("collections.empty")}</p>
        </div>
      ) : (
        <div className="grid-gallery-collection">
          {categories.filter((cat) => (cat?._count?.products ?? 0) > 0).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="aspect-[4/5] bg-secondary/30 relative overflow-hidden mb-4">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-heading uppercase text-foreground/20 group-hover:text-foreground/10 transition-colors select-none">
                      {category.name ? category.name[0] : "?"}
                    </span>
                  </div>
                )
                }
                <div className="absolute inset-0 bg-luxury-gradient opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                  <div className="bg-background/90 backdrop-blur-md px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold">
                    {t("shop.product.viewCollection")}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start flex-col md:flex-row md:items-end">
                  <h3 className="text-2xl lg:text-3xl font-heading group-hover:text-primary transition-colors">{category.name}</h3>
                  <span className="text-spaced-bold font-bold text-muted-foreground mb-1">{category._count?.products || 0} {t("home.categories.pieces")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
