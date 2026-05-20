"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
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



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "0",
    stock: "1",
    categoryId: "",
    images: [] as string[],
    isFeatured: false,
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
        });
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
      if (isEdit) {
        await updateProductById(productId!, formData);
      } else {
        await createProduct(formData);
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

          <div className="bg-background border border-border/50 p-8 rounded-lg space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-border/30 pb-4">Media Assets</h3>
            <ImageUpload
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
              maxFiles={4}
            />
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
