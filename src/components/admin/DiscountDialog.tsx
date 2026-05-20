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
import { Plus, Tag, Loader2, Save } from "lucide-react";
import { useDiscountStore } from "@/store/discountStore";
import { useTranslation } from "@/context/TranslationContext";

interface DiscountFormValues {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  usageLimit?: number | null;
  expiryDate?: string | null;
  status: "ACTIVE" | "SCHEDULED" | "EXPIRED";
}

interface DiscountDialogProps {
  discount?: any;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DiscountDialog({ discount, trigger, open: externalOpen, onOpenChange: setExternalOpen }: DiscountDialogProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchDiscounts } = useDiscountStore();
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
  } = useForm<DiscountFormValues>({
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      value: 0,
      usageLimit: null,
      expiryDate: "",
      status: "ACTIVE",
    },
  });

  // Reset form when discount changes
  useEffect(() => {
    if (discount) {
      reset({
        ...discount,
        expiryDate: discount.expiryDate ? new Date(discount.expiryDate).toISOString().split('T')[0] : ""
      });
    } else {
      reset({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        usageLimit: null,
        expiryDate: "",
        status: "ACTIVE",
      });
    }
  }, [discount, reset]);

  const discountType = watch("type");
  const discountStatus = watch("status");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const url = discount ? `/api/admin/discounts/${discount.id}` : "/api/admin/discounts";
      const method = discount ? "PATCH" : "POST";

      const payload = {
        ...data,
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || t("admin.discounts.dialog.saveError"));
      }

      toast.success(discount ? t("admin.discounts.dialog.messages.updateSuccess") : t("admin.discounts.dialog.messages.createSuccess"));
      setOpen?.(false);
      if (!discount) reset();
      await fetchDiscounts(true);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("admin.common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> {t("admin.discounts.newOffer")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">
            {discount ? t("admin.discounts.dialog.titleEdit") : t("admin.discounts.dialog.titleCreate")}
          </DialogTitle>
          <p className="text-muted-foreground font-serif italic text-sm">
            {discount ? t("admin.discounts.dialog.descEdit") : t("admin.discounts.dialog.descCreate")}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.code")}</Label>
              <Input
                placeholder="e.g., ROYAL20"
                {...register("code", { required: "Code is required" })}
                className="h-12 border-border/50 font-mono tracking-wider uppercase"
                onChange={(e) => setValue("code", e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.type")}</Label>
              <Select
                value={discountType}
                onValueChange={(val: any) => setValue("type", val)}
              >
                <SelectTrigger className="h-12 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.value")}</Label>
              <Input
                type="number"
                placeholder="0"
                {...register("value", { required: "Value is required" })}
                className="h-12 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.usageLimit")}</Label>
              <Input
                type="number"
                placeholder="Unlimited"
                {...register("usageLimit")}
                className="h-12 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.expiryDate")}</Label>
              <Input
                type="date"
                {...register("expiryDate")}
                className="h-12 border-border/50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">{t("admin.discounts.dialog.labels.status")}</Label>
              <Select
                value={discountStatus}
                onValueChange={(val: any) => setValue("status", val)}
              >
                <SelectTrigger className="h-12 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 uppercase tracking-[0.2em] text-[10px] font-bold mt-4"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {discount ? t("admin.discounts.dialog.buttons.edit") : t("admin.discounts.dialog.buttons.create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
