"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "../ui/label";
import { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useRouter, useSearchParams } from "next/navigation";

const materials = ["18k Yellow Gold", "Platinum", "Rose Gold", "Sterling Silver"];

export function FilterSidebar() {
  const { categories, fetchCategories } = useCategoryStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("categoryId") === categoryId) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", categoryId);
    }
    router.push(`/shop?${params.toString()}`);
  };
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
      <div>
        <h3 className="text-luxury mb-6 font-heading text-2xl">Filter By</h3>

        <Accordion defaultValue={["price"]} className="w-full">

          {/* Price Range */}
          <AccordionItem value="price" className="border-b border-muted-foreground/10">
            <AccordionTrigger className="font-heading text-lg py-3 hover:no-underline uppercase tracking-widest text-sm">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4 px-1">
                <Slider defaultValue={[0, 100000]} max={100000} step={1000} className="text-primary" />
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <span>₹0</span>
                  <span>₹1,00,000+</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="pt-4 border-muted-foreground/10">
        <button
          onClick={() => router.push("/shop")}
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary hover:opacity-70 transition-opacity border-b border-primary/30 pb-1"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
