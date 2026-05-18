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

export function FilterDrawer(props: FilterSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" className="lg:hidden flex items-center gap-2 h-11 px-6 uppercase tracking-widest text-[10px]">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </Button>
        }
      />
      <SheetContent side="left" className="w-full sm:max-w-xs flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="font-heading text-2xl">Filter Selection</SheetTitle>
        </SheetHeader>
        <div className="p-6 flex-1 overflow-y-auto">
          <FilterSidebar {...props}/>
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
