"use client";

import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface FilterSidebarProps {
  showCategories?: boolean;
  onCategoryChange?: (categoryIds: string[]) => void;
  activeCategoryIds?: string[];
}

export function FilterSidebar({ showCategories = false, onCategoryChange, activeCategoryIds }: FilterSidebarProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000
  ]);

  useEffect(() => {
    setPriceRange([
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 10000
    ]);
  }, [searchParams]);

  // Collections mode uses prop array; shop mode reads from URL
  const currentCategoryIds: string[] = activeCategoryIds !== undefined
    ? activeCategoryIds
    : searchParams.get("categoryId")
      ? [searchParams.get("categoryId")!]
      : [];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (categoryId: string) => {
    if (onCategoryChange) {
      // Toggle: add if not present, remove if already selected
      const next = currentCategoryIds.includes(categoryId)
        ? currentCategoryIds.filter((id) => id !== categoryId)
        : [...currentCategoryIds, categoryId];
      onCategoryChange(next);
      return;
    }

    // Shop mode: single category via URL (extend this if you want multi in URL too)
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("categoryId") === categoryId) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", categoryId);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceChange = (val: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", val[0].toString());
    params.set("maxPrice", val[1].toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    if (onCategoryChange) {
      onCategoryChange([]);
    } else {
      router.push("/shop");
    }
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h3 className="text-luxury mb-6 font-heading text-2xl">Filter By</h3>

        <Accordion defaultValue={["price"]} className="w-full">

          {showCategories && (
            <AccordionItem value="categories" className="border-b border-muted-foreground/10">
              <AccordionTrigger className="hover:no-underline uppercase tracking-widest text-sm py-3">
                Categories
                {currentCategoryIds.length > 0 && (
                  <span className="ml-2 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                    {currentCategoryIds.length}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-4 px-1">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={currentCategoryIds.includes(String(category.id))}
                        onChange={() => handleCategoryChange(String(category.id))}
                        className="accent-primary h-4 w-4 cursor-pointer"
                      />
                      <span className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
                      No categories found
                    </p>
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
                  defaultValue={[Number(searchParams.get("minPrice")) || 0, Number(searchParams.get("maxPrice")) || 10000]}
                  max={10000}
                  step={100}
                  className="text-primary"
                  onValueChange={(val) => {
                    if (Array.isArray(val)) setPriceRange(val as number[]);
                  }}
                  onValueCommitted={(val) => {
                    if (Array.isArray(val)) handlePriceChange(val as number[]);
                  }}
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                  <span>₹{priceRange[1].toLocaleString("en-IN")}{priceRange[1] === 10000 ? "+" : ""}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>

      <div className="pt-4 border-muted-foreground/10">
        <button
          onClick={handleClear}
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity border-b border-primary/30 pb-1 cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}