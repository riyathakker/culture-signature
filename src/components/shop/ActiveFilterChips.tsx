"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useTranslation } from "@/context/TranslationContext";

interface ActiveFilterChipsProps {
  categoryIds: string[];
  onCategoryChange: (ids: string[]) => void;
  inStockOnly: boolean;
  onInStockChange: (v: boolean) => void;
  hasDiscountOnly: boolean;
  onHasDiscountChange: (v: boolean) => void;
  priceRange: [number, number];
  onPriceChange: (v: [number, number]) => void;
  maxPrice: number;
}

export function ActiveFilterChips({
  categoryIds,
  onCategoryChange,
  inStockOnly,
  onInStockChange,
  hasDiscountOnly,
  onHasDiscountChange,
  priceRange,
  onPriceChange,
  maxPrice,
}: ActiveFilterChipsProps) {
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const priceActive = priceRange[0] > 0 || priceRange[1] < maxPrice;
  const hasAny = categoryIds.length > 0 || inStockOnly || hasDiscountOnly || priceActive;
  if (!hasAny) return null;

  const chip = (key: string, label: string, onRemove: () => void) => (
    <button
      key={key}
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 pl-3 pr-2 py-1 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
    >
      {label}
      <X className="w-3 h-3" />
    </button>
  );

  const clearAll = () => {
    onCategoryChange([]);
    onInStockChange(false);
    onHasDiscountChange(false);
    onPriceChange([0, maxPrice]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categoryIds.map((id) => {
        const name = categories.find((c) => String(c.id) === id)?.name ?? "Category";
        return chip(id, name, () => onCategoryChange(categoryIds.filter((c) => c !== id)));
      })}
      {inStockOnly && chip("instock", t("shop.filter.inStock"), () => onInStockChange(false))}
      {hasDiscountOnly && chip("sale", t("shop.filter.onSale"), () => onHasDiscountChange(false))}
      {priceActive &&
        chip(
          "price",
          `₹${priceRange[0].toLocaleString("en-IN")} – ₹${priceRange[1].toLocaleString("en-IN")}`,
          () => onPriceChange([0, maxPrice])
        )}
      <button
        onClick={clearAll}
        className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer ml-1"
      >
        {t("shop.filter.clearAll")}
      </button>
    </div>
  );
}
