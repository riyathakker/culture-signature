"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Checkbox } from "lucide-react";
import { en } from "@/locales/en";

const t = en.admin.categories.dialog;

interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
  isArchived: boolean;
}

interface CategoryDialogProps {
  category?: any;
  trigger?: React.ReactNode;
  onSuccess?: (category: any) => void;
}

export function CategoryDialog({ category, trigger, onSuccess }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: category || {
      name: "",
      slug: "",
      description: "",
      isArchived: false,
    },
  });

  const categoryName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && categoryName) {
      const slug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [categoryName, setValue, category]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const url = category ? `/api/categories/${category.id}` : "/api/categories";
      const method = category ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save category");
      }

      const savedCategory = await response.json();
      toast.success(category ? "Collection refined" : "Collection established");
      setOpen(false);
      if (!category) reset();
      if (onSuccess) onSuccess(savedCategory);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-luxury px-6 gap-2">
            <Plus className="w-4 h-4" /> {en.admin.categories.newCategory}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">
            {category ? t.titleEdit : t.titleCreate}
          </DialogTitle>
          <p className="text-muted-foreground font-serif italic text-sm">
            {category ? t.descEdit : t.descCreate}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t.labels.name}</Label>
              <Input
                placeholder="e.g., Heritage Gold"
                {...register("name", { required: "Name is required" })}
                className="h-12 border-border/50"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t.labels.slug}</Label>
              <Input
                placeholder="heritage-gold"
                {...register("slug", { required: "Slug is required" })}
                className="h-12 border-border/50 font-mono text-xs"
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t.labels.description}</Label>
              <Textarea
                placeholder="Describe the thematic essence of this collection..."
                {...register("description")}
                className="min-h-[100px] border-border/50 font-serif italic"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 uppercase tracking-[0.2em] text-[10px] font-bold mt-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {category ? t.buttons.edit : t.buttons.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
