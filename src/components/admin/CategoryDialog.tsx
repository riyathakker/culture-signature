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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Save } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useTranslation } from "@/context/TranslationContext";

interface CategoryFormValues {
  name: string;
  status: "ACTIVE" | "ARCHIVED";
}

interface CategoryDialogProps {
  category?: any;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (category: any) => void;
}

export function CategoryDialog({
  category,
  trigger,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  onSuccess,
}: CategoryDialogProps) {
  const { t } = useTranslation();
  const { createCategory, updateCategoryById } = useCategoryStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const router = useRouter();

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? setExternalOpen : setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: "", status: "ACTIVE" },
  });

  useEffect(() => {
    if (category) {
      reset({ name: category.name || "", status: category.status || "ACTIVE" });
      setImage(category.image ? [category.image] : []);
    } else {
      reset({ name: "", status: "ACTIVE" });
      setImage([]);
    }
  }, [category, reset]);

  const categoryStatus = watch("status");

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const img = image[0] ?? null;
      const savedCategory = category
        ? await updateCategoryById(category.id, data.name, data.status, img)
        : await createCategory(data.name, img);

      toast.success(category ? t("admin.categories.dialog.messages.updateSuccess") : t("admin.categories.dialog.messages.createSuccess"));
      setOpen?.(false);
      if (!category) { reset(); setImage([]); }
      if (onSuccess) onSuccess(savedCategory);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("admin.common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger>
          <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> {category ? t("admin.categories.dialog.buttons.edit") : t("admin.categories.newCategory")}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[500px] bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">
            {category ? t("admin.categories.dialog.titleEdit") : t("admin.categories.dialog.titleCreate")}
          </DialogTitle>
          <p className="muted-italic text-sm">
            {category ? t("admin.categories.dialog.descEdit") : t("admin.categories.dialog.descCreate")}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.categories.dialog.labels.name")}</Label>
              <Input
                placeholder={t("admin.categories.dialog.placeholders.name")}
                {...register("name", { required: t("admin.categories.dialog.validation.nameRequired") })}
                className="h-12 border-border/50"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-spaced-bold opacity-60">{t("admin.categories.dialog.labels.image")}</Label>
              <ImageUpload value={image} onChange={setImage} maxFiles={1} />
            </div>

            {category && (
              <div className="space-y-2">
                <Label className="text-spaced-bold opacity-60">{t("admin.categories.dialog.labels.status")}</Label>
                <Select value={categoryStatus} onValueChange={(val: any) => setValue("status", val)}>
                  <SelectTrigger className="h-12 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">{t("admin.categories.dialog.status.active")}</SelectItem>
                    <SelectItem value="ARCHIVED">{t("admin.categories.dialog.status.archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 uppercase tracking-[0.2em] text-[10px] font-bold mt-4">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {category ? t("admin.categories.dialog.buttons.edit") : t("admin.categories.dialog.buttons.create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
