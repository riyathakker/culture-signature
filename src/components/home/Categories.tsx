"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { CommonLoader } from "../common/Loader";
import { SectionTitle } from "../ui/SectionTitle";
import { en } from "@/locales/en";

function CategoryCards() {
  const {categories , isLoading , fetchCategories} = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) return (
    <CommonLoader />
  );

  return (
    <section className="py-12 border-y border-muted-foreground/10">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/collections/${cat.id}`}
              className="group flex flex-col items-center p-10 bg-secondary/60 hover:bg-primary transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="w-10 h-10 mb-6 relative z-10">
                <div className="w-full h-full bg-primary/20 rounded-full group-hover:bg-background/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-heading group-hover:text-white transition-colors">
                  {cat.name[0]}
                </div>
              </div>
              <h4 className="font-heading text-xl group-hover:text-primary-foreground transition-all duration-500 relative z-10 text-center">{cat.name}</h4>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-primary-foreground/70 transition-colors mt-3 relative z-10">
                {cat._count?.products || 0} {en.home.categories.pieces}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Categories(){
  return(
    <Container className="pt-12">
        <SectionTitle title={en.home.categories.title} subtitle={en.home.categories.subtitle} align="center" />
        <CategoryCards />
      </Container>
  )
}