"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, CheckCircle2, XCircle, Loader2, UploadCloud, ChevronDown, ChevronUp, CopyCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/categoryStore";
import { ProductService } from "@/services/product";
import { ImageUpload } from "@/components/admin/ImageUpload";

type RowStatus = "idle" | "loading" | "success" | "error";

interface BulkRow {
  uid: string;
  title: string;
  description: string;
  price: string;
  discount: string;
  stock: string;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  status: RowStatus;
  errorMsg?: string;
  showImages: boolean;
  isOpen: boolean;
}

let uidCounter = 0;
const makeRow = (): BulkRow => ({
  uid: `row-${++uidCounter}`,
  title: "",
  description: "",
  price: "",
  discount: "0",
  stock: "1",
  categoryId: "",
  images: [],
  isFeatured: false,
  status: "idle",
  showImages: false,
  isOpen: true,
});

interface GlobalDefaults {
  categoryId: string;
  price: string;
  discount: string;
  stock: string;
}

export default function BulkProductUpload() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const [rows, setRows] = useState<BulkRow[]>([makeRow(), makeRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globals, setGlobals] = useState<GlobalDefaults>({
    categoryId: "", price: "", discount: "", stock: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const applyToAll = (fields: Partial<GlobalDefaults>) => {
    const patch: Partial<BulkRow> = {};
    if (fields.categoryId) patch.categoryId = fields.categoryId;
    if (fields.price) patch.price = fields.price;
    if (fields.discount !== undefined && fields.discount !== "") patch.discount = fields.discount;
    if (fields.stock) patch.stock = fields.stock;
    setRows((prev) =>
      prev.map((r) => (r.status === "idle" || r.status === "error") ? { ...r, ...patch } : r)
    );
    toast.success("Applied to all pending rows.");
  };

  const updateRow = (uid: string, patch: Partial<BulkRow>) =>
    setRows((prev) => prev.map((r) => (r.uid === uid ? { ...r, ...patch } : r)));

  const removeRow = (uid: string) =>
    setRows((prev) => prev.length > 1 ? prev.filter((r) => r.uid !== uid) : prev);

  const addRow = () => setRows((prev) => [
    ...prev,
    {
      ...makeRow(),
      ...(globals.categoryId && { categoryId: globals.categoryId }),
      ...(globals.price && { price: globals.price }),
      ...(globals.discount !== "" && { discount: globals.discount }),
      ...(globals.stock && { stock: globals.stock }),
    },
  ]);

  const validRows = rows.filter(
    (r) => r.title.trim() && r.price && r.categoryId
  );

  const uploadSingle = async (row: BulkRow): Promise<void> => {
    updateRow(row.uid, { status: "loading", errorMsg: undefined });
    try {
      await ProductService.create({
        title: row.title.trim(),
        description: row.description.trim(),
        price: row.price,
        discount: row.discount || "0",
        stock: row.stock || "1",
        categoryId: row.categoryId,
        images: row.images,
        isFeatured: row.isFeatured,
      });
      updateRow(row.uid, { status: "success" });
    } catch (e: any) {
      updateRow(row.uid, { status: "error", errorMsg: e.message });
      throw e;
    }
  };

  const handlePublishAll = async () => {
    if (validRows.length === 0) {
      toast.error("Fill in Name, Price, and Category for at least one product.");
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    await Promise.allSettled(
      validRows.map((row) =>
        uploadSingle(row).then(() => { successCount++; }).catch(() => { failCount++; })
      )
    );

    setIsSubmitting(false);

    if (failCount === 0) {
      toast.success(`${successCount} product${successCount > 1 ? "s" : ""} published successfully.`);
      router.push("/admin/products");
    } else {
      toast.error(`${failCount} product${failCount > 1 ? "s" : ""} failed. Review errors below.`);
    }
  };

  const successCount = rows.filter((r) => r.status === "success").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-heading tracking-tight">Bulk Upload</h1>
          <p className="muted-italic text-sm">Add multiple products at once. Fill name, price and category — then publish all.</p>
        </div>
        <Button
          onClick={handlePublishAll}
          disabled={isSubmitting || validRows.length === 0}
          className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20 flex-shrink-0"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
          ) : (
            <><UploadCloud className="w-4 h-4 mr-2" /> Publish All ({validRows.length})</>
          )}
        </Button>
      </div>

      {/* Global defaults */}
      <div className="border border-border/50 rounded-lg bg-secondary/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">
            Apply Same Value to All Rows
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyToAll(globals)}
            disabled={isSubmitting || (!globals.categoryId && !globals.price && globals.discount === "" && !globals.stock)}
            className="h-8 text-[10px] uppercase tracking-widest font-bold gap-1.5"
          >
            <CopyCheck className="w-3.5 h-3.5" /> Apply to All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Category</Label>
            <Select
              value={globals.categoryId}
              onValueChange={(val) => val && setGlobals((g) => ({ ...g, categoryId: val }))}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
                <SelectValue placeholder="Same for all">
                  {categories.find((c) => c.id === globals.categoryId)?.name ?? "Same for all"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Price (₹)</Label>
            <Input
              type="number"
              placeholder="Same for all"
              value={globals.price}
              onChange={(e) => setGlobals((g) => ({ ...g, price: e.target.value }))}
              disabled={isSubmitting}
              className="h-9 border-border/50"
            />
          </div>

          {/* Discount */}
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Discount (₹)</Label>
            <Input
              type="number"
              placeholder="Same for all"
              value={globals.discount}
              onChange={(e) => setGlobals((g) => ({ ...g, discount: e.target.value }))}
              disabled={isSubmitting}
              className="h-9 border-border/50"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Stock</Label>
            <Input
              type="number"
              placeholder="Same for all"
              min={0}
              value={globals.stock}
              onChange={(e) => setGlobals((g) => ({ ...g, stock: e.target.value }))}
              disabled={isSubmitting}
              className="h-9 border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {(successCount > 0 || errorCount > 0) && (
        <div className="flex gap-4">
          {successCount > 0 && (
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> {successCount} published
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <XCircle className="w-4 h-4" /> {errorCount} failed
            </div>
          )}
        </div>
      )}

      {/* Product rows */}
      <div className="space-y-4">
        {rows.map((row, index) => (
          <ProductRow
            key={row.uid}
            row={row}
            index={index}
            categories={categories}
            onUpdate={(patch) => updateRow(row.uid, patch)}
            onRemove={() => removeRow(row.uid)}
            disabled={isSubmitting}
          />
        ))}
      </div>

      {/* Add row */}
      <Button
        variant="outline"
        onClick={addRow}
        disabled={isSubmitting}
        className="w-full h-12 border-dashed border-border/60 uppercase tracking-[0.2em] text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Another Product
      </Button>
    </div>
  );
}

function ProductRow({
  row, index, categories, onUpdate, onRemove, disabled,
}: {
  row: BulkRow;
  index: number;
  categories: { id: string; name: string }[];
  onUpdate: (patch: Partial<BulkRow>) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const statusColor: Record<RowStatus, string> = {
    idle: "border-border/50",
    loading: "border-primary/40",
    success: "border-success/60 bg-success/5",
    error: "border-destructive/60 bg-destructive/5",
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden transition-colors", statusColor[row.status])}>
      {/* Accordion header — always visible */}
      <div className="flex items-center gap-3 px-5 py-3 bg-secondary/30">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground w-6 flex-shrink-0">
          #{index + 1}
        </span>
        <Input
          placeholder="Product name *"
          value={row.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          disabled={disabled || row.status === "success"}
          className="flex-1 h-9 border-0 bg-transparent p-0 text-sm font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0"
        />

        {/* Summary chips when collapsed */}
        {!row.isOpen && row.categoryId && (
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded flex-shrink-0">
            {categories.find((c) => c.id === row.categoryId)?.name}
          </span>
        )}
        {!row.isOpen && row.price && (
          <span className="hidden sm:inline text-[9px] font-bold text-muted-foreground flex-shrink-0">
            ₹{row.price}
          </span>
        )}

        {/* Status */}
        {row.status === "loading" && <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />}
        {row.status === "success" && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
        {row.status === "error" && (
          <Badge variant="outline" className="text-[9px] border-destructive text-destructive flex-shrink-0">
            {row.errorMsg || "Failed"}
          </Badge>
        )}

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onUpdate({ isOpen: !row.isOpen })}
          className="h-7 w-7 text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          {row.isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disabled}
          className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Accordion body — animated */}
      <div className={cn("grid transition-all duration-200 ease-in-out", row.isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="border-t border-inherit">
            {/* Fields grid */}
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Category */}
              <div className="space-y-1.5 lg:col-span-2">
                <Label className="text-spaced-bold">Category *</Label>
                <Select
                  value={row.categoryId}
                  onValueChange={(val) => val && onUpdate({ categoryId: val })}
                  disabled={disabled || row.status === "success"}
                >
                  <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
                    <SelectValue placeholder="Select">
                      {categories.find((c) => c.id === row.categoryId)?.name ?? "Select"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Price (₹) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={row.price}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  disabled={disabled || row.status === "success"}
                  className="h-9 border-border/50"
                />
              </div>

              {/* Discount */}
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Disc (₹)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={row.discount}
                  onChange={(e) => onUpdate({ discount: e.target.value })}
                  disabled={disabled || row.status === "success"}
                  className="h-9 border-border/50"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Stock</Label>
                <Input
                  type="number"
                  placeholder="1"
                  min={0}
                  value={row.stock}
                  onChange={(e) => onUpdate({ stock: e.target.value })}
                  disabled={disabled || row.status === "success"}
                  className="h-9 border-border/50"
                />
              </div>

              {/* Featured */}
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Featured</Label>
                <div className="h-9 flex items-center">
                  <Switch
                    checked={row.isFeatured}
                    onCheckedChange={(v) => onUpdate({ isFeatured: v })}
                    disabled={disabled || row.status === "success"}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-5 pb-4">
              <Textarea
                placeholder="Description (optional)"
                value={row.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                disabled={disabled || row.status === "success"}
                className="min-h-[72px] resize-none border-border/50 text-sm"
              />
            </div>

            {/* Images toggle */}
            <div className="border-t border-inherit">
              <button
                type="button"
                onClick={() => onUpdate({ showImages: !row.showImages })}
                disabled={disabled || row.status === "success"}
                className="w-full flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Images {row.images.length > 0 ? `(${row.images.length})` : ""}</span>
                {row.showImages ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {row.showImages && (
                <div className="px-5 pb-5">
                  <ImageUpload
                    value={row.images}
                    onChange={(urls) => onUpdate({ images: urls })}
                    maxFiles={4}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
