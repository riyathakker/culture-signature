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
    <div className="max-w-[100vw] overflow-hidden ml-4">
      <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {categories.filter((cat) => (cat?._count?.products || 0) > 0).map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="group flex flex-col items-center p-8 bg-secondary/60 hover:bg-primary transition-all duration-700 relative overflow-hidden flex-shrink-0 min-w-[160px] md:min-w-[200px]"
          >
            <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="w-10 h-10 mb-4 relative z-10">
              <div className="w-full h-full bg-primary/20 rounded-full group-hover:bg-background/20 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-heading group-hover:text-white transition-colors uppercase">
                {cat.name ? cat.name[0] : "?"}
              </div>
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
    <div className="py-20">
      <SectionTitle title={t("home.categories.title")} subtitle={t("home.categories.subtitle")} align="center" />
      <CategoryCards />
    </div>
  )
}