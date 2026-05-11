"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Save,
  Image as ImageIcon,
  Loader2,
  Trash2
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { CommonLoader } from "../common/Loader";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  console.log("product id", productId);
  const { addProduct, updateProduct } = useProductStore();
  const { categories, fetchCategories, addCategory: storeAddCategory } = useCategoryStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
  });

  useEffect(() => {
    fetchInitialData();
  }, [productId]);

  const fetchInitialData = async () => {
    try {
      await fetchCategories();

      if (isEdit) {
        setIsFetching(true);
        const prodRes = await fetch(`/api/admin/products/${productId}`);
        if (!prodRes.ok) throw new Error("Failed to fetch product");
        const prod = await prodRes.json();

        setFormData({
          title: prod.title || "",
          description: prod.description || "",
          price: prod.price?.toString() || "",
          stock: prod.stock?.toString() || "",
          categoryId: prod.categoryId || "",
          images: prod.images || [],
        });
      }
    } catch (error) {
      toast.error(isEdit ? "Failed to load masterpiece details" : "Failed to load categories");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSubmittingCategory(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create category");
      }

      const data = await response.json();
      storeAddCategory(data);
      setFormData((prev) => ({ ...prev, categoryId: data.id }));
      setNewCategoryName("");
      setIsAddingCategory(false);
      toast.success("Category added and selected.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        if (isEdit) {
          updateProduct(savedProduct);
        } else {
          addProduct(savedProduct);
        }

        toast.success(isEdit ? "Masterpiece updated successfully" : "Masterpiece added to collection successfully");
        router.push("/admin/products");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || (isEdit ? "Failed to update product" : "Failed to add product"));
      }
    } catch (error) {
      toast.error("Error saving product");
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
          {isEdit && <p className="text-muted-foreground font-serif italic">Update the details of your artisanal creation.</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Product Name</Label>
                <Input
                  placeholder="e.g., Aurelia Diamond Ring"
                  className="h-12 rounded-none border-border/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Description</Label>
                <Textarea
                  placeholder="Describe the inspiration, materials, and craftsmanship..."
                  className="min-h-[200px] rounded-none border-border/50 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-border/30 pb-4">Media Assets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="aspect-[3/4] relative border border-border/30 rounded-sm overflow-hidden group">
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => {
                  const url = prompt("Enter image URL:");
                  if (url) setFormData({ ...formData, images: [...formData.images, url] });
                }}
                className="aspect-[3/4] border-2 border-dashed border-border/50 rounded-sm flex flex-col items-center justify-center gap-2 hover:bg-secondary/20 transition-colors cursor-pointer group"
              >
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                  {isEdit ? "Add Image" : "Upload Image"}
                </span>
              </div>
              {formData.images.length === 0 && [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-secondary/10 border border-border/30 rounded-sm flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Category</Label>
                <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                  <DialogTrigger>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-secondary/50">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription className="font-serif italic text-base pt-2">
                        Create a new curated grouping for your masterpieces.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-bold">Category Name</Label>
                        <Input
                          placeholder="e.g., Diamond Essentials"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="h-12 rounded-none border-border/50 uppercase text-[10px] tracking-widest font-bold"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAddCategory}
                        disabled={isSubmittingCategory || !newCategoryName.trim()}
                        className="w-full h-12 uppercase tracking-[0.2em] text-[10px] font-bold"
                      >
                        {isSubmittingCategory ? "Saving..." : "Save Category"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Select
                value={formData.categoryId}
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                required
              >
                <SelectTrigger className="h-12 rounded-none border-border/50 uppercase text-[10px] tracking-widest font-bold">
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
                <Label className="text-[10px] uppercase tracking-widest font-bold">Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-12 rounded-none border-border/50"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">
                  {isEdit ? "Stock Count" : "Initial Stock"}
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 rounded-none border-border/50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
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
