"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCategoryStore } from "@/store/categoryStore";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";
import { CategoriesSkeleton } from "@/components/home/HomeSkeletons";

function CategoryCards() {
  const { categories } = useCategoryStore();
  const { t } = useTranslation();

  return (
    <div className="max-w-[100vw] overflow-hidden">
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar px-4 sm:px-6 lg:px-8 scroll-smooth">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 5) * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0"
          >
          <Link
            href={`/categories/${cat.id}`}
            className="group flex flex-col items-center py-12 bg-secondary/60 hover:bg-primary transition-all duration-700 relative overflow-hidden w-[42vw] max-w-[200px] min-w-[140px] md:w-[200px]"
          >
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
              />
            )}
            <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="w-10 h-10 mb-2 relative z-10 flex items-center justify-center">
              <span className="text-xl font-heading uppercase group-hover:text-white transition-colors">
                {cat.name ? cat.name[0] : "?"}
              </span>
            </div>
            <h4 className="font-heading text-xl group-hover:text-primary-foreground transition-all duration-500 relative z-10 text-center">{cat.name}</h4>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-primary-foreground/70 transition-colors mt-2 relative z-10">
              {cat._count?.products || 0} {t("home.categories.pieces")}
            </p>
          </Link>
          </motion.div>
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

  if (isLoading && (!categories || categories.length === 0)) {
    return <CategoriesSkeleton />;
  }

  if (!isLoading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <div className="py-10 bg-accent border-y border-border/40">
      <SectionTitle title={t("home.categories.title")} subtitle={t("home.categories.subtitle")} align="center" />
      <CategoryCards />
    </div>
  )
}