"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { useTranslation } from "@/context/TranslationContext";

interface Props {
  excludeId?: string;
}

export function RecentlyViewed({ excludeId }: Props) {
  const { products, hydrate } = useRecentlyViewedStore();
  const { t } = useTranslation();
  useEffect(() => { hydrate(); }, [hydrate]);
  const visible = products.filter((p) => p.id !== excludeId);

  if (visible.length === 0) return null;

  return (
    <div className="mt-16">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-5">
        {t("shop.product.recentlyViewed")}
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {visible.map((p) => {
          const finalPrice = p.price - (p.discount || 0);
          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="flex-shrink-0 w-28 snap-start group"
            >
              <div className="w-28 h-36 rounded-lg overflow-hidden bg-secondary/30 relative mb-2">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {p.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ₹{finalPrice.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
