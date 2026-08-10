"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, CheckCircle2, Loader2, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useTranslation } from "@/context/TranslationContext";
import { BulkColorEntry, BulkRow, PoolImage, RowStatus } from "@/types/bulk";
import { hexToColorName } from "@/lib/colorName";
import { swatchStyle } from "@/lib/colorVariant";
import { NoImage } from "@/components/common/NoImage";

interface BulkProductRowProps {
  row: BulkRow;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  categories: { id: string; name: string }[];
  imagePool: PoolImage[];
  rows: BulkRow[];
  onUpdate: (patch: Partial<BulkRow>) => void;
  onRemove: () => void;
  disabled: boolean;
}

export function BulkProductRow({
  row,
  index,
  isOpen,
  onToggle,
  categories,
  imagePool,
  rows,
  onUpdate,
  onRemove,
  disabled,
}: BulkProductRowProps) {
  const { t } = useTranslation();
  const [imageTab, setImageTab] = useState<"pool" | "direct">("pool");
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const statusColor: Record<RowStatus, string> = {
    idle: "border-border/50",
    loading: "border-primary/40",
    success: "border-success/60 bg-success/5",
    error: "border-destructive/60 bg-destructive/5",
  };

  const togglePoolImage = (url: string) => {
    const already = row.images.includes(url);
    if (already) {
      onUpdate({ images: row.images.filter((u) => u !== url) });
    } else if (row.images.length < 4) {
      onUpdate({ images: [...row.images, url] });
    } else {
      toast.error(t("admin.products.bulk.toast.maxImages"));
    }
  };

  const isAssignedElsewhere = (url: string) =>
    rows.some((r) => r.uid !== row.uid && r.images.includes(url));

  return (
    <div className={cn("border rounded-lg overflow-hidden transition-colors", statusColor[row.status])}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/30 min-w-0">
        <span className="text-[10px] font-bold text-muted-foreground flex-shrink-0 w-5">
          #{index + 1}
        </span>
        <Input
          placeholder={t("admin.products.bulk.placeholders.productName")}
          value={row.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          disabled={disabled || row.status === "success"}
          className="flex-1 min-w-0 h-9 border-0 bg-transparent p-0 text-sm font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />

        {!isOpen && row.categoryId && (
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded flex-shrink-0">
            {categories.find((c) => c.id === row.categoryId)?.name}
          </span>
        )}
        {!isOpen && row.price && (
          <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground flex-shrink-0">
            ₹{row.price}
          </span>
        )}

        {row.status === "loading" && <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />}
        {row.status === "success" && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
        {row.status === "error" && (
          <Badge variant="outline" className="text-[9px] border-destructive text-destructive flex-shrink-0">
            {row.errorMsg || t("admin.products.bulk.toast.failed")}
          </Badge>
        )}

        <Button variant="ghost" size="icon" type="button" onClick={onToggle}
          className="h-7 w-7 text-muted-foreground hover:text-foreground flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove} disabled={disabled}
          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Accordion body */}
      <div className={cn("grid transition-all duration-200 ease-in-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="border-t border-inherit">
            {/* Fields */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <Label className="text-spaced-bold">{t("admin.products.bulk.labels.categoryRequired")}</Label>
                <Select value={row.categoryId}
                  onValueChange={(val) => val && onUpdate({ categoryId: val })}
                  disabled={disabled || row.status === "success"}>
                  <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
                    <SelectValue placeholder={t("admin.products.bulk.placeholders.select")}>
                      {categories.find((c) => c.id === row.categoryId)?.name ?? t("admin.products.bulk.placeholders.select")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">{t("admin.products.bulk.labels.priceRequired")}</Label>
                <Input type="number" placeholder="0" value={row.price}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">{t("admin.products.bulk.labels.discountShort")}</Label>
                <Input type="number" placeholder="0" value={row.discount}
                  onChange={(e) => onUpdate({ discount: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">{t("admin.products.bulk.labels.stock")}</Label>
                <Input type="number" placeholder="1" min={0} value={row.stock}
                  onChange={(e) => onUpdate({ stock: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">{t("admin.products.bulk.labels.featured")}</Label>
                <div className="h-9 flex items-center">
                  <Switch checked={row.isFeatured}
                    onCheckedChange={(v) => onUpdate({ isFeatured: v })}
                    disabled={disabled || row.status === "success"} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 pb-4">
              <Textarea placeholder={t("admin.products.bulk.labels.description")} value={row.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                disabled={disabled || row.status === "success"}
                className="min-h-[72px] resize-none border-border/50 text-sm" />
            </div>

            {/* Colors section — tabs, one editor visible at a time */}
            <div className="px-4 pb-4 space-y-3 border-t border-inherit pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Switch
                  checked={row.enableColors}
                  onCheckedChange={(v) => onUpdate({ enableColors: v })}
                  disabled={disabled || row.status === "success"}
                />
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Add color variants</span>
              </label>

              {row.enableColors && (
              <>
              <div className="flex items-center gap-2 flex-wrap">
                {row.colors.map((c, ci) => {
                  const isActive = ci === Math.min(activeColorIdx, row.colors.length - 1);
                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => setActiveColorIdx(ci)}
                      className={cn(
                        "flex items-center gap-1.5 h-8 px-2.5 rounded-full border text-[10px] font-medium transition-all",
                        isActive
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border/50 text-muted-foreground hover:border-foreground/40"
                      )}
                    >
                      <span className="w-3 h-3 rounded-full border border-border/50" style={swatchStyle(c.hex, c.hex2)} />
                      {c.name?.trim() || `Color ${ci + 1}`}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={disabled || row.status === "success"}
                  onClick={() => {
                    setActiveColorIdx(row.colors.length);
                    onUpdate({ colors: [...row.colors, { name: hexToColorName("#000000"), hex: "#000000", images: [] }] });
                  }}
                  className="flex items-center gap-1 h-8 px-2.5 rounded-full border border-dashed border-primary/50 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {row.colors.length > 0 && (() => {
                const ci = Math.min(activeColorIdx, row.colors.length - 1);
                const c = row.colors[ci];
                const update = (patch: Partial<BulkColorEntry>) =>
                  onUpdate({ colors: row.colors.map((x, xi) => (xi === ci ? { ...x, ...patch } : x)) });
                const locked = disabled || row.status === "success";
                const autoName = (hex: string, hex2?: string) =>
                  hex2 ? `${hexToColorName(hex)} & ${hexToColorName(hex2)}` : hexToColorName(hex);
                const isAutoNamed = !c.name || c.name === autoName(c.hex, c.hex2);
                return (
                  <div className="space-y-3 border border-border/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c.hex}
                        disabled={locked}
                        onChange={(e) => {
                          const newHex = e.target.value;
                          update({ hex: newHex, ...(isAutoNamed ? { name: autoName(newHex, c.hex2) } : {}) });
                        }}
                        className="w-9 h-9 rounded cursor-pointer border border-border/50 p-0.5 bg-transparent"
                        title="Pick color — name auto-fills"
                      />
                      {c.hex2 ? (
                        <div className="relative">
                          <input
                            type="color"
                            value={c.hex2}
                            disabled={locked}
                            onChange={(e) => {
                              const newHex2 = e.target.value;
                              update({ hex2: newHex2, ...(isAutoNamed ? { name: autoName(c.hex, newHex2) } : {}) });
                            }}
                            className="w-9 h-9 rounded cursor-pointer border border-border/50 p-0.5 bg-transparent"
                            title="Second color"
                          />
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() => update({ hex2: undefined, ...(isAutoNamed ? { name: autoName(c.hex) } : {}) })}
                            className="absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 text-muted-foreground hover:text-destructive disabled:opacity-40"
                            title="Remove second color"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => update({ hex2: "#ffffff", ...(isAutoNamed ? { name: autoName(c.hex, "#ffffff") } : {}) })}
                          className="w-9 h-9 rounded border border-dashed border-primary/50 text-primary hover:bg-primary/5 flex items-center justify-center disabled:opacity-40"
                          title="Add a second color (two-tone)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Input
                        placeholder="Color name (e.g. Midnight Black)"
                        value={c.name}
                        disabled={locked}
                        onChange={(e) => update({ name: e.target.value })}
                        className="h-9 border-border/50 flex-1"
                      />
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => {
                          setActiveColorIdx((cur) => Math.max(0, Math.min(cur, row.colors.length - 2)));
                          onUpdate({ colors: row.colors.filter((_, xi) => xi !== ci) });
                        }}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-40 p-1"
                        title="Remove this color"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Images for this color</Label>
                      {c.images.length === 0 && (
                        <NoImage className="h-20 rounded-lg border border-dashed border-border/50" />
                      )}
                      <ImageUpload
                        value={c.images}
                        onChange={(urls) => update({ images: urls })}
                        maxFiles={4}
                        compact
                      />
                    </div>
                  </div>
                );
              })()}
              </>
              )}
            </div>

            {/* Images section */}
            <div className="border-t border-inherit">
              {/* Tab toggle */}
              <div className="flex items-center gap-0 border-b border-inherit">
                <button type="button"
                  onClick={() => setImageTab("pool")}
                  className={cn(
                    "flex-1 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
                    imageTab === "pool"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                  {t("admin.products.bulk.imagePool.tabPool")} {imagePool.length > 0 && `(${row.images.filter(u => imagePool.some(p => p.url === u)).length}/${imagePool.length})`}
                </button>
                <button type="button"
                  onClick={() => setImageTab("direct")}
                  className={cn(
                    "flex-1 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
                    imageTab === "direct"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                  {t("admin.products.bulk.imagePool.tabDirect")}
                </button>
              </div>

              <div className="p-4">
                {imageTab === "pool" ? (
                  imagePool.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      {t("admin.products.bulk.imagePool.emptyPool")}
                    </p>
                  ) : (
                    <>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-3">
                        {t("admin.products.bulk.labels.poolImageAssign")}
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {imagePool.map((img) => {
                          const selected = row.images.includes(img.url);
                          const elsewhere = !selected && isAssignedElsewhere(img.url);
                          return (
                            <button
                               key={img.id}
                              type="button"
                              onClick={() => !disabled && row.status !== "success" && togglePoolImage(img.url)}
                              disabled={disabled || row.status === "success"}
                              className={cn(
                                "relative aspect-square rounded-sm overflow-hidden border-2 transition-all",
                                selected ? "border-primary shadow-md" : "border-transparent",
                                elsewhere && "opacity-40",
                                !disabled && row.status !== "success" && "cursor-pointer hover:opacity-90"
                              )}
                            >
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                              {selected && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )
                ) : (
                  <ImageUpload
                    value={row.images.filter((u) => !imagePool.some((p) => p.url === u))}
                    onChange={(urls) => {
                      const poolUrls = row.images.filter((u) => imagePool.some((p) => p.url === u));
                      onUpdate({ images: [...poolUrls, ...urls] });
                    }}
                    maxFiles={Math.max(0, 4 - row.images.filter((u) => imagePool.some((p) => p.url === u)).length)}
                    compact
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
