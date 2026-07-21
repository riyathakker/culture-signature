"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { CommonLoader } from "../common/Loader";
import { ImageUpload } from "./ImageUpload";
import { ColorVariant } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  const { categories, fetchCategories, addCategory: storeAddCategory } = useCategoryStore();
  const { fetchProductById, createProduct, updateProductById } = useProductStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [enableColors, setEnableColors] = useState(false);



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "0",
    stock: "1",
    categoryId: "",
    images: [] as string[],
    isFeatured: false,
    isLimitedDrop: false,
    colors: [] as ColorVariant[],
  });

  // Persist form to localStorage
  useEffect(() => {
    if (!isEdit && !isFetching) {
      const saved = localStorage.getItem("product_draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to load draft", e);
        }
      }
    }
  }, [isEdit, isFetching]);

  useEffect(() => {
    if (!isEdit && !isFetching) {
      localStorage.setItem("product_draft", JSON.stringify(formData));
    }
  }, [formData, isEdit, isFetching]);

  // Clear draft when navigating away without submitting
  useEffect(() => {
    if (!isEdit) {
      return () => {
        localStorage.removeItem("product_draft");
      };
    }
  }, [isEdit]);

  useEffect(() => {
    fetchInitialData();
  }, [productId]);

  const fetchInitialData = async () => {
    try {
      await fetchCategories();

      if (isEdit) {
        setIsFetching(true);
        const prod = await fetchProductById(productId!);

        setFormData({
          title: prod.name || "",
          description: prod.description || "",
          price: prod.price?.toString() || "",
          discount: prod.discount?.toString() || "0",
          stock: prod.stock?.toString() || "1",
          categoryId: prod.categoryId || "",
          images: prod.images || [],
          isFeatured: prod.isFeatured || false,
          isLimitedDrop: prod.isLimitedDrop || false,
          colors: (prod.colors as ColorVariant[]) || [],
        });
        setEnableColors((((prod.colors as ColorVariant[]) || []).length) > 0);
      }
    } catch (error) {
      toast.error(isEdit ? "Failed to load masterpiece details" : "Failed to load categories");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { ...formData, colors: enableColors ? formData.colors : [] };
      if (isEdit) {
        await updateProductById(productId!, payload);
      } else {
        await createProduct(payload);
      }

      toast.success(isEdit ? "Masterpiece updated successfully" : "Masterpiece added to collection successfully");
      if (!isEdit) localStorage.removeItem("product_draft");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || (isEdit ? "Failed to update product" : "Failed to add product"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <CommonLoader />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-heading tracking-tight">
            {isEdit ? "Refine Masterpiece" : "New Masterpiece"}
          </h1>
          {isEdit && <p className="muted-italic">Update the details of your artisanal creation.</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-spaced-bold">Product Name</Label>
                <Input
                  placeholder="e.g., Aurelia Diamond Ring"
                  className="h-12 border-border/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-spaced-bold">Description</Label>
                <Textarea
                  placeholder="Describe the inspiration, materials, and craftsmanship..."
                  className="min-h-[200px] border-border/50 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-background border border-border/50 p-6 rounded-lg">
            <ImageUpload
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
              maxFiles={4}
              compact
            />
          </div>

          {/* Color Variants */}
          <div className="bg-background border border-border/50 p-8 rounded-lg space-y-6">
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch checked={enableColors} onCheckedChange={setEnableColors} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Add color variants</span>
              </label>
              {enableColors && (
                <span className="text-[10px] text-muted-foreground">
                  {formData.colors.length} {formData.colors.length === 1 ? "color" : "colors"}
                </span>
              )}
            </div>

            {!enableColors ? (
              <p className="text-xs text-muted-foreground italic">Turn on to add color variants, each with its own images.</p>
            ) : (
            <>
            {/* Tabs — one per color, plus an add button */}
            <div className="flex items-center gap-2 flex-wrap">
              {formData.colors.map((color, i) => {
                const isActive = i === Math.min(activeColorIdx, formData.colors.length - 1);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveColorIdx(i)}
                    className={cn(
                      "flex items-center gap-2 h-9 px-3 rounded-full border text-[11px] font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border/50 text-muted-foreground hover:border-foreground/40"
                    )}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-border/50"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name?.trim() || `Color ${i + 1}`}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setActiveColorIdx(formData.colors.length);
                  setFormData((prev) => ({
                    ...prev,
                    colors: [...prev.colors, { name: "", hex: "#000000", images: [] }],
                  }));
                }}
                className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-dashed border-primary/50 text-[11px] uppercase tracking-widest font-bold text-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {formData.colors.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No color variants added. Click "Add" to create one with its own price, stock, and images.</p>
            ) : (() => {
              const idx = Math.min(activeColorIdx, formData.colors.length - 1);
              const color = formData.colors[idx];
              return (
                <div className="space-y-4 border border-border/30 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => {
                          const updated = [...formData.colors];
                          updated[idx] = { ...updated[idx], hex: e.target.value };
                          setFormData((prev) => ({ ...prev, colors: updated }));
                        }}
                        className="w-10 h-10 rounded cursor-pointer border border-border/50 p-0.5 bg-transparent"
                        title="Pick color"
                      />
                      <Input
                        placeholder="Color name (e.g. Midnight Black)"
                        value={color.name}
                        onChange={(e) => {
                          const updated = [...formData.colors];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setFormData((prev) => ({ ...prev, colors: updated }));
                        }}
                        className="h-10 border-border/50 flex-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveColorIdx((cur) => Math.max(0, Math.min(cur, formData.colors.length - 2)));
                        setFormData((prev) => ({
                          ...prev,
                          colors: prev.colors.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove this color"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest text-muted-foreground">Images for this color</Label>
                    <ImageUpload
                      value={color.images}
                      onChange={(urls) => {
                        const updated = [...formData.colors];
                        updated[idx] = { ...updated[idx], images: urls };
                        setFormData((prev) => ({ ...prev, colors: updated }));
                      }}
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
        </div>

        <div className="space-y-6">
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-spaced-bold">Category</Label>
              </div>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => setFormData({ ...formData, categoryId: val || "" })}
                required
              >
                <SelectTrigger className="h-12 w-full border-border/50 uppercase text-[10px] tracking-widest font-bold">
                  <SelectValue placeholder="Select Category">
                    {categories.find(c => c.id === formData.categoryId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <Label className="text-spaced-bold">Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-12 border-border/50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-spaced-bold">Discount (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-12 border-border/50"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-spaced-bold">
                  {isEdit ? "Stock Count" : "Initial Stock"}
                </Label>
                <Input
                  type="number"
                  placeholder="1"
                  className="h-12 border-border/50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border/50 rounded-sm bg-secondary/5">
                <div className="space-y-1">
                  <Label className="text-spaced-bold">Featured Product</Label>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Show in featured collection</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border/50 rounded-sm bg-secondary/5">
                <div className="space-y-1">
                  <Label className="text-spaced-bold">Limited Drop</Label>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Highlight as limited / scarce piece</p>
                </div>
                <Switch
                  checked={formData.isLimitedDrop}
                  onCheckedChange={(checked) => setFormData({ ...formData, isLimitedDrop: checked })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 uppercase tracking-[0.3em] text-[10px] font-bold shadow-xl shadow-primary/20"
            >
              {isLoading ? (isEdit ? "Saving..." : "Preserving...") : (isEdit ? "Update Masterpiece" : "Publish Masterpiece")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full h-14 uppercase tracking-[0.3em] text-[10px] font-bold border-border/50"
            >
              {isEdit ? "Discard Changes" : "Discard Draft"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
