"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";

function CategoryCards() {
  const { categories } = useCategoryStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar px-4 sm:px-6 lg:px-8 scroll-smooth">
        {categories.filter((cat) => (cat?._count?.products || 0) > 0).map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="group flex flex-col items-center p-8 bg-secondary/60 hover:bg-primary transition-all duration-700 relative overflow-hidden flex-shrink-0 w-[42vw] max-w-[200px] min-w-[140px] md:w-[200px]"
          >
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
              />
            )}
            <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="w-10 h-10 mb-4 relative z-10 flex items-center justify-center">
              <span className="text-2xl font-heading uppercase group-hover:text-white transition-colors">
                {cat.name ? cat.name[0] : "?"}
              </span>
            </div>
            <h4 className="font-heading text-xl group-hover:text-primary-foreground transition-all duration-500 relative z-10 text-center">{cat.name}</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-primary-foreground/70 transition-colors mt-2 relative z-10">
              {cat._count?.products || 0} {t("home.categories.pieces")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Categories() {
  const { t } = useTranslation();
  const { categories, isLoading, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!isLoading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <div className="py-10 md:py-18">
      <SectionTitle title={t("home.categories.title")} subtitle={t("home.categories.subtitle")} align="center" />
      <CategoryCards />
    </div>
  )
}