"use client";

import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useTranslation } from "@/context/TranslationContext";

export interface FilterDraft {
  categoryIds: string[];
  inStock: boolean;
  discount: boolean;
  price: [number, number];
}

export interface FilterSidebarProps {
  showCategories?: boolean;
  activeCategoryIds?: string[];
  onCategoryChange?: (ids: string[]) => void;
  inStockOnly?: boolean;
  onInStockChange?: (v: boolean) => void;
  hasDiscountOnly?: boolean;
  onHasDiscountChange?: (v: boolean) => void;
  priceRange?: [number, number];
  onPriceChange?: (val: [number, number]) => void;
  maxPrice?: number;
  filteredCount?: number;
  // Live preview count for the current draft selection (before Apply).
  getFilteredCount?: (draft: FilterDraft) => number;
  onApply?: () => void;
}

export function FilterSidebar({
  showCategories = false,
  activeCategoryIds = [],
  onCategoryChange,
  inStockOnly = false,
  onInStockChange,
  hasDiscountOnly = false,
  onHasDiscountChange,
  priceRange = [0, 100000],
  onPriceChange,
  maxPrice = 100000,
  filteredCount,
  getFilteredCount,
  onApply,
}: FilterSidebarProps) {
  const { t } = useTranslation();
  const { categories, fetchCategories } = useCategoryStore();

  // Draft state — user edits these; only flushed to parent on Apply
  const [draftCategoryIds, setDraftCategoryIds] = useState<string[]>(activeCategoryIds);
  const [draftInStock, setDraftInStock] = useState(inStockOnly);
  const [draftDiscount, setDraftDiscount] = useState(hasDiscountOnly);
  const [draftPrice, setDraftPrice] = useState<[number, number]>([priceRange[0], priceRange[1]]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCategoryToggle = (categoryId: string) => {
    setDraftCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleApply = () => {
    onCategoryChange?.(draftCategoryIds);
    onInStockChange?.(draftInStock);
    onHasDiscountChange?.(draftDiscount);
    onPriceChange?.(draftPrice);
    onApply?.();
  };

  const handleClear = () => {
    setDraftCategoryIds([]);
    setDraftInStock(false);
    setDraftDiscount(false);
    setDraftPrice([0, maxPrice]);
    onCategoryChange?.([]);
    onInStockChange?.(false);
    onHasDiscountChange?.(false);
    onPriceChange?.([0, maxPrice]);
    onApply?.();
  };

  const draftFilterCount =
    draftCategoryIds.length + (draftInStock ? 1 : 0) + (draftDiscount ? 1 : 0);
  const hasActiveFilters =
    draftFilterCount > 0 || draftPrice[0] > 0 || draftPrice[1] < maxPrice;

  // Live count for the current draft; falls back to the applied count.
  const previewCount = getFilteredCount
    ? getFilteredCount({
        categoryIds: draftCategoryIds,
        inStock: draftInStock,
        discount: draftDiscount,
        price: draftPrice,
      })
    : filteredCount;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h3 className="text-luxury mb-6 font-heading text-2xl">{t("shop.filter.title")}</h3>

        <Accordion defaultValue={["availability", "price"]} className="w-full">

          <AccordionItem value="availability" className="border-b border-muted-foreground/10">
            <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
              {t("shop.filter.availability")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-4 px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={draftInStock}
                    onChange={(e) => setDraftInStock(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {t("shop.filter.inStock")}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={draftDiscount}
                    onChange={(e) => setDraftDiscount(e.target.checked)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {t("shop.filter.onSale")}
                  </span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {showCategories && (
            <AccordionItem value="categories" className="border-b border-muted-foreground/10">
              <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
                {t("shop.filter.categories")}
                {draftCategoryIds.length > 0 && (
                  <span className="ml-2 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                    {draftCategoryIds.length}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-4 px-1">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={draftCategoryIds.includes(String(category.id))}
                        onChange={() => handleCategoryToggle(String(category.id))}
                        className="accent-primary h-4 w-4 cursor-pointer"
                      />
                      <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{t("shop.filter.noCategories")}</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="price" className="border-b border-muted-foreground/10">
            <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
              {t("shop.filter.priceRange")}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4 px-1">
                <Slider
                  value={draftPrice}
                  max={maxPrice}
                  step={500}
                  className="text-primary"
                  onValueChange={(val) => setDraftPrice(val as [number, number])}
                />
                <div className="flex justify-between text-spaced-bold text-muted-foreground">
                  <span>₹{draftPrice[0].toLocaleString("en-IN")}</span>
                  <span>₹{draftPrice[1].toLocaleString("en-IN")}{draftPrice[1] >= maxPrice ? "+" : ""}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      <div className="space-y-3 border-muted-foreground/10">
        {previewCount !== undefined && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold text-center">
            {previewCount} {previewCount === 1 ? t("shop.filter.product") : t("shop.filter.products")}
          </p>
        )}
        <Button
          onClick={handleApply}
          className="w-full py-3 uppercase tracking-[0.2em] text-xs h-auto"
        >
          {t("shop.filter.apply")}
        </Button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="w-full text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity cursor-pointer text-center"
          >
            {t("shop.filter.clearAll")} {draftFilterCount > 0 ? `(${draftFilterCount})` : ""}
          </button>
        )}
      </div>
    </aside>
  );
}
