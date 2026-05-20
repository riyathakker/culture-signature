"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, CheckCircle2, XCircle, Loader2, UploadCloud,
  ChevronDown, ChevronUp, CopyCheck, Check, Images, X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
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
import { useProductStore } from "@/store/productStore";
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
}

interface PoolImage {
  id: string;
  url: string;
}

interface GlobalDefaults {
  name: string;
  categoryId: string;
  price: string;
  discount: string;
  stock: string;
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
});

export default function BulkProductUpload() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchProducts } = useProductStore();
  const initialRows = [makeRow(), makeRow()];
  const [rows, setRows] = useState<BulkRow[]>(initialRows);
  const [openUid, setOpenUid] = useState<string | null>(initialRows[0].uid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globals, setGlobals] = useState<GlobalDefaults>({
    name: "", categoryId: "", price: "", discount: "", stock: "",
  });
  const [imagePool, setImagePool] = useState<PoolImage[]>([]);

  useEffect(() => { fetchCategories(); }, []);

  const toggleOpen = (uid: string) =>
    setOpenUid((prev) => (prev === uid ? null : uid));

  const applyToAll = (fields: Partial<GlobalDefaults>) => {
    const patch: Partial<BulkRow> = {};
    if (fields.name) patch.title = fields.name;
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

  const addRow = () => {
    const newRow: BulkRow = {
      ...makeRow(),
      ...(globals.name && { title: globals.name }),
      ...(globals.categoryId && { categoryId: globals.categoryId }),
      ...(globals.price && { price: globals.price }),
      ...(globals.discount !== "" && { discount: globals.discount }),
      ...(globals.stock && { stock: globals.stock }),
    };
    setRows((prev) => [...prev, newRow]);
    setOpenUid(newRow.uid);
  };

  const addToPool = useCallback((urls: string[]) => {
    setImagePool((prev) => [
      ...prev,
      ...urls.map((url) => ({ id: Math.random().toString(36).slice(2), url })),
    ]);
  }, []);

  const removeFromPool = useCallback((url: string) => {
    setRows((prev) => prev.map((r) => ({ ...r, images: r.images.filter((img) => img !== url) })));
    setImagePool((prev) => prev.filter((p) => p.url !== url));
  }, []);

  const validRows = rows.filter((r) => r.title.trim() && r.price && r.categoryId);

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
      await fetchProducts(true);
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
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-heading tracking-tight">Bulk Upload</h1>
        </div>
        <Button
          onClick={handlePublishAll}
          disabled={isSubmitting || validRows.length === 0}
          className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20 flex-shrink-0"
        >
          {isSubmitting
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
            : <><UploadCloud className="w-4 h-4 mr-2" />Upload ({validRows.length})</>}
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
            disabled={isSubmitting || (!globals.name && !globals.categoryId && !globals.price && globals.discount === "" && !globals.stock)}
            className="h-8 text-[10px] uppercase tracking-widest font-bold gap-1.5"
          >
            <CopyCheck className="w-3.5 h-3.5" /> Apply to All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
            <Label className="text-spaced-bold">Name</Label>
            <Input placeholder="Same for all" value={globals.name}
              onChange={(e) => setGlobals((g) => ({ ...g, name: e.target.value }))}
              disabled={isSubmitting} className="h-9 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Category</Label>
            <Select value={globals.categoryId}
              onValueChange={(val) => val && setGlobals((g) => ({ ...g, categoryId: val }))}
              disabled={isSubmitting}>
              <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
                <SelectValue placeholder="Same for all">
                  {categories.find((c) => c.id === globals.categoryId)?.name ?? "Same for all"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Price (₹)</Label>
            <Input type="number" placeholder="Same for all" value={globals.price}
              onChange={(e) => setGlobals((g) => ({ ...g, price: e.target.value }))}
              disabled={isSubmitting} className="h-9 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Discount (₹)</Label>
            <Input type="number" placeholder="Same for all" value={globals.discount}
              onChange={(e) => setGlobals((g) => ({ ...g, discount: e.target.value }))}
              disabled={isSubmitting} className="h-9 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-spaced-bold">Stock</Label>
            <Input type="number" placeholder="Same for all" min={0} value={globals.stock}
              onChange={(e) => setGlobals((g) => ({ ...g, stock: e.target.value }))}
              disabled={isSubmitting} className="h-9 border-border/50" />
          </div>
        </div>
      </div>

      {/* Image pool */}
      <ImagePool
        imagePool={imagePool}
        rows={rows}
        onAdd={addToPool}
        onRemove={removeFromPool}
        disabled={isSubmitting}
      />

      {/* Stats */}
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
            isOpen={openUid === row.uid}
            onToggle={() => toggleOpen(row.uid)}
            categories={categories}
            imagePool={imagePool}
            rows={rows}
            onUpdate={(patch) => updateRow(row.uid, patch)}
            onRemove={() => removeRow(row.uid)}
            disabled={isSubmitting}
          />
        ))}
      </div>

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

/* ─── Image Pool ──────────────────────────────────────────────────── */

function ImagePool({
  imagePool, rows, onAdd, onRemove, disabled,
}: {
  imagePool: PoolImage[];
  rows: BulkRow[];
  onAdd: (urls: string[]) => void;
  onRemove: (url: string) => void;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const urls = await Promise.all(
        acceptedFiles.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload failed");
          return (await res.json()).url as string;
        })
      );
      onAdd(urls);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} added to pool.`);
    } catch {
      toast.error("Some images failed to upload.");
    } finally {
      setIsUploading(false);
    }
  }, [onAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    disabled: isUploading || disabled,
    multiple: true,
  });

  const getAssignment = (url: string) => {
    const idx = rows.findIndex((r) => r.images.includes(url));
    return idx === -1 ? null : idx + 1;
  };

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-secondary/20 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <Images className="w-4 h-4" />
          Image Pool
          {imagePool.length > 0 && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[9px]">
              {imagePool.length} image{imagePool.length > 1 ? "s" : ""}
            </span>
          )}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Body */}
      <div className={cn("grid transition-all duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="p-4 space-y-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Upload all your product images here at once, then assign them to individual products below.
            </p>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/20",
                (isUploading || disabled) && "opacity-50 pointer-events-none"
              )}
            >
              <input {...getInputProps()} />
              {isUploading
                ? <Loader2 className="w-6 h-6 text-primary animate-spin" />
                : <UploadCloud className="w-6 h-6 text-muted-foreground" />}
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center">
                {isDragActive ? "Drop images here" : "Click or drag to upload multiple images"}
              </p>
              <p className="text-[9px] text-muted-foreground/60 italic">JPEG, PNG, WebP — no limit</p>
            </div>

            {/* Pool grid */}
            {imagePool.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {imagePool.map((img) => {
                  const assignedTo = getAssignment(img.url);
                  return (
                    <div key={img.id} className="relative group aspect-square rounded-sm overflow-hidden border border-border/30">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {/* Assignment badge */}
                      {assignedTo !== null && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[8px] font-bold text-center py-0.5">
                          #{assignedTo}
                        </div>
                      )}
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => onRemove(img.url)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Row ─────────────────────────────────────────────────── */

function ProductRow({
  row, index, isOpen, onToggle, categories, imagePool, rows, onUpdate, onRemove, disabled,
}: {
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
}) {
  const [imageTab, setImageTab] = useState<"pool" | "direct">("pool");

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
      toast.error("Max 4 images per product.");
    }
  };

  // Is a pool image assigned to ANY OTHER row?
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
          placeholder="Product name *"
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
            {row.errorMsg || "Failed"}
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
                <Label className="text-spaced-bold">Category *</Label>
                <Select value={row.categoryId}
                  onValueChange={(val) => val && onUpdate({ categoryId: val })}
                  disabled={disabled || row.status === "success"}>
                  <SelectTrigger className="h-11 w-full border-border/50 text-[10px] uppercase tracking-widest font-bold">
                    <SelectValue placeholder="Select">
                      {categories.find((c) => c.id === row.categoryId)?.name ?? "Select"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Price (₹) *</Label>
                <Input type="number" placeholder="0" value={row.price}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Disc (₹)</Label>
                <Input type="number" placeholder="0" value={row.discount}
                  onChange={(e) => onUpdate({ discount: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Stock</Label>
                <Input type="number" placeholder="1" min={0} value={row.stock}
                  onChange={(e) => onUpdate({ stock: e.target.value })}
                  disabled={disabled || row.status === "success"} className="h-9 border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-spaced-bold">Featured</Label>
                <div className="h-9 flex items-center">
                  <Switch checked={row.isFeatured}
                    onCheckedChange={(v) => onUpdate({ isFeatured: v })}
                    disabled={disabled || row.status === "success"} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 pb-4">
              <Textarea placeholder="Description (optional)" value={row.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                disabled={disabled || row.status === "success"}
                className="min-h-[72px] resize-none border-border/50 text-sm" />
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
                  From Pool {imagePool.length > 0 && `(${row.images.filter(u => imagePool.some(p => p.url === u)).length}/${imagePool.length})`}
                </button>
                <button type="button"
                  onClick={() => setImageTab("direct")}
                  className={cn(
                    "flex-1 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors",
                    imageTab === "direct"
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                  Upload Direct
                </button>
              </div>

              <div className="p-4">
                {imageTab === "pool" ? (
                  imagePool.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      No images in pool yet. Upload images to the pool above, then select them here.
                    </p>
                  ) : (
                    <>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-3">
                        Click to assign — max 4 per product
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
