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
    <div className="flex items-center gap-4">
      <span className="text-spaced-bold text-muted-foreground whitespace-nowrap">Sort By</span>
      <Select value={sortBy} onValueChange={(val) => {
        if (val)
          onSortChange(val)
      }}>
        <SelectTrigger className="w-[180px] h-11 border-muted-foreground/20 rounded-none focus:ring-primary uppercase text-[10px] tracking-widest font-bold">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="rounded-none border-primary/20">
          <SelectItem value="newest" className="uppercase text-[10px] tracking-widest font-bold">Newest Arrivals</SelectItem>
          <SelectItem value="price-low" className="uppercase text-[10px] tracking-widest font-bold">Price: Low to High</SelectItem>
          <SelectItem value="price-high" className="uppercase text-[10px] tracking-widest font-bold">Price: High to Low</SelectItem>
          <SelectItem value="popularity" className="uppercase text-[10px] tracking-widest font-bold">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
