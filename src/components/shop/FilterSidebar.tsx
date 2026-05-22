"use client";

import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";

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
  onApply,
}: FilterSidebarProps) {
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

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h3 className="text-luxury mb-6 font-heading text-2xl">Filter By</h3>

        <Accordion defaultValue={["availability", "price"]} className="w-full">

          <AccordionItem value="availability" className="border-b border-muted-foreground/10">
            <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
              Availability
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
                    In Stock Only
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
                    On Sale
                  </span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {showCategories && (
            <AccordionItem value="categories" className="border-b border-muted-foreground/10">
              <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
                Categories
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
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest">No categories found</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="price" className="border-b border-muted-foreground/10">
            <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
              Price Range
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

      <div className="space-y-3 pt-4 border-t border-muted-foreground/10">
        {filteredCount !== undefined && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold text-center">
            {filteredCount} {filteredCount === 1 ? "Product" : "Products"}
          </p>
        )}
        <Button
          onClick={handleApply}
          className="w-full py-5 uppercase tracking-[0.2em] text-xs h-auto"
        >
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="w-full text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity cursor-pointer text-center"
          >
            Clear All Filters {draftFilterCount > 0 ? `(${draftFilterCount})` : ""}
          </button>
        )}
      </div>
    </aside>
  );
}
