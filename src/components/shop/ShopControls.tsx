"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShopControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ShopControls({ sortBy, onSortChange }: ShopControlsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <span className="hidden sm:inline-block text-spaced-bold text-muted-foreground whitespace-nowrap">Sort By</span>
      <Select value={sortBy} onValueChange={(val) => {
        if (val)
          onSortChange(val)
      }}>
        <SelectTrigger className="w-[140px] sm:w-[180px] h-11 border-muted-foreground/20 rounded-none focus:ring-primary text-spaced-bold">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="rounded border-primary/20">
          <SelectItem value="newest" className="text-spaced-bold">Newest Arrivals</SelectItem>
          <SelectItem value="price-low" className="text-spaced-bold">Price: Low to High</SelectItem>
          <SelectItem value="price-high" className="text-spaced-bold">Price: High to Low</SelectItem>
          <SelectItem value="popularity" className="text-spaced-bold">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
