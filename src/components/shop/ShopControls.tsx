"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/context/TranslationContext";

interface ShopControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ShopControls({ sortBy, onSortChange }: ShopControlsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <span className="hidden sm:inline-block text-spaced-bold text-muted-foreground whitespace-nowrap">{t("shop.sort.label")}</span>
      <Select value={sortBy} onValueChange={(val) => {
        if (val)
          onSortChange(val)
      }}>
        <SelectTrigger className="w-[140px] sm:w-[180px] h-10 border-muted-foreground/20 rounded-lg focus:ring-primary text-spaced-bold">
          <SelectValue placeholder={t("shop.sort.label")} />
        </SelectTrigger>
        <SelectContent className="rounded border-primary/20">
          <SelectItem value="newest" className="text-spaced-bold">{t("shop.sort.newest")}</SelectItem>
          <SelectItem value="price-low" className="text-spaced-bold">{t("shop.sort.priceLow")}</SelectItem>
          <SelectItem value="price-high" className="text-spaced-bold">{t("shop.sort.priceHigh")}</SelectItem>
          <SelectItem value="popularity" className="text-spaced-bold">{t("shop.sort.popular")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
