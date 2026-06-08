"use client";

import { CopyCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/context/TranslationContext";
import { GlobalDefaults } from "@/types/bulk";

interface BulkGlobalDefaultsProps {
  globals: GlobalDefaults;
  setGlobals: React.Dispatch<React.SetStateAction<GlobalDefaults>>;
  categories: { id: string; name: string }[];
  applyToAll: (fields: Partial<GlobalDefaults>) => void;
  disabled: boolean;
}

export function BulkGlobalDefaults({
  globals,
  setGlobals,
  categories,
  applyToAll,
  disabled,
}: BulkGlobalDefaultsProps) {
  const { t } = useTranslation();

  const isApplyDisabled =
    disabled ||
    (!globals.name &&
      !globals.categoryId &&
      !globals.price &&
      globals.discount === "");

  return (
    <div className="border border-border/50 rounded-lg bg-secondary/20 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">
          {t("admin.products.bulk.applyAll")}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => applyToAll(globals)}
          disabled={isApplyDisabled}
          className="h-8 text-[10px] uppercase tracking-widest font-bold gap-1.5"
        >
          <CopyCheck className="w-3.5 h-3.5" /> {t("admin.products.bulk.applyBtn")}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
          <Label className="text-spaced-bold">{t("admin.products.bulk.labels.name")}</Label>
          <Input
            placeholder={t("admin.products.bulk.placeholders.sameForAll")}
            value={globals.name}
            onChange={(e) => setGlobals((g) => ({ ...g, name: e.target.value }))}
            disabled={disabled}
            className="h-9 border-border/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-spaced-bold">{t("admin.products.bulk.labels.category")}</Label>
          <Select
            value={globals.categoryId}
            onValueChange={(val) => val && setGlobals((g) => ({ ...g, categoryId: val }))}
            disabled={disabled}
          >
            <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
              <SelectValue placeholder={t("admin.products.bulk.placeholders.sameForAll")}>
                {categories.find((c) => c.id === globals.categoryId)?.name ??
                  t("admin.products.bulk.placeholders.sameForAll")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-spaced-bold">{t("admin.products.bulk.labels.price")}</Label>
          <Input
            type="number"
            placeholder={t("admin.products.bulk.placeholders.sameForAll")}
            value={globals.price}
            onChange={(e) => setGlobals((g) => ({ ...g, price: e.target.value }))}
            disabled={disabled}
            className="h-9 border-border/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-spaced-bold">{t("admin.products.bulk.labels.discount")}</Label>
          <Input
            type="number"
            placeholder={t("admin.products.bulk.placeholders.sameForAll")}
            value={globals.discount}
            onChange={(e) => setGlobals((g) => ({ ...g, discount: e.target.value }))}
            disabled={disabled}
            className="h-9 border-border/50"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-spaced-bold">{t("admin.products.bulk.labels.stock")}</Label>
          <Input
            type="number"
            placeholder={t("admin.products.bulk.placeholders.sameForAll")}
            min={0}
            value={globals.stock}
            onChange={(e) => setGlobals((g) => ({ ...g, stock: e.target.value }))}
            disabled={disabled}
            className="h-9 border-border/50"
          />
        </div>
      </div>
    </div>
  );
}
