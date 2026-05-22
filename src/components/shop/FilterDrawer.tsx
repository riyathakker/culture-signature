"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSidebar, FilterSidebarProps } from "./FilterSidebar";
import { cn } from "@/lib/utils";

export function FilterDrawer(props: FilterSidebarProps) {
  const activeCount =
    (props.activeCategoryIds?.length ?? 0) +
    (props.inStockOnly ? 1 : 0) +
    (props.hasDiscountOnly ? 1 : 0);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-2 h-10 px-4 uppercase tracking-widest text-[10px] relative"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
            {activeCount > 0 && (
              <span className={cn(
                "absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              )}>
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent side="left" className="w-full sm:max-w-xs flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="font-heading text-2xl">Filter Selection</SheetTitle>
        </SheetHeader>
        <div className="p-6 flex-1 overflow-y-auto">
          <FilterSidebar {...props} />
        </div>
        <div className="p-6 border-t">
          <Button className="w-full py-6 uppercase tracking-[0.2em] text-xs h-auto">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
