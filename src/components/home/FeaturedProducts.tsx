"use client";

import { useEffect, useMemo } from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductRowSkeleton } from "@/components/home/HomeSkeletons";

import { useProductStore } from "@/store/productStore";

import { useTranslation } from "@/context/TranslationContext";
import { Product } from "@/types";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const BENTO_LAYOUT: string[] = [
  "col-start-1 col-span-3 row-start-1 row-span-2",
  "col-start-4 col-span-2 row-start-1",
  "col-start-6 col-span-3 row-start-1",
  "col-start-4 col-span-3 row-start-2",
  "col-start-7 col-span-2 row-start-2",
  "col-start-1 col-span-3 row-start-3",
  "col-start-4 col-span-5 row-start-3 row-span-2",
  "col-start-1 col-span-3 row-start-4",
];

function buildFeatured(products: Product[]) {
  return products
    .slice(0, BENTO_LAYOUT.length)
    .map((product) => ({ product, img: product.images?.[0] }));
}


function FeaturedTile({
  product,
  img,
  index,
  className,
}: {
  product: Product;
  img?: string;
  index: number;
  className?: string;
}) {
  const price = product.price - (product.discount || 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      <Link
        href={`/product/${product.id}`}
        className="group relative block h-full w-full overflow-hidden rounded-lg bg-secondary/30"
      >
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Name + price scrim — always visible, intensifies on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 md:p-3 translate-y-0 transition-transform duration-500 md:translate-y-1 md:group-hover:translate-y-0">
          <h3 className="font-heading text-white text-xs md:text-sm leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-white/85 text-[10px] md:text-xs font-medium mt-0.5">
            ₹{price.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const {
    fetchFeaturedProducts,
    featuredProducts,
    isLoading,
  } = useProductStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const tiles = useMemo(() => buildFeatured(featuredProducts), [featuredProducts]);



  if (!isLoading && (!featuredProducts || featuredProducts.length === 0)) {
    return null;
  }

  return (
    <section className="py-10 pwa-section border-t border-border/50">
      <Container>
        <SectionTitle
          title={t("home.featured.title")}
          subtitle={t("home.featured.subtitle")}
        />

        {isLoading ? (
          <ProductRowSkeleton width={160} count={6} />
        ) : (
          <>
            <div className="grid grid-cols-8 auto-rows-[70px] gap-2 md:hidden">
              {tiles.map(({ product, img }, idx: number) => (
                <FeaturedTile
                  key={product.id}
                  product={product}
                  img={img}
                  index={idx}
                  className={cn("w-full h-full", BENTO_LAYOUT[idx])}
                />
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-8 md:auto-rows-[150px] md:gap-3 md:max-w-7xl md:mx-auto">
              {tiles.map(({ product, img }, idx: number) => (
                <FeaturedTile
                  key={product.id}
                  product={product}
                  img={img}
                  index={idx}
                  className={cn("w-full h-full", BENTO_LAYOUT[idx])}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                href={ROUTES.COLLECTIONS}
                className="btn-luxury-outline"
              >
                {t("home.featured.viewCollection")}
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}