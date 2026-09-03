"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, Loader2 } from "lucide-react";

import { useAddressStore } from "@/store/addressStore";
import dynamic from "next/dynamic";
import { useTranslation } from "@/context/TranslationContext";

// Lazy-load the location picker (large country-state-city dataset) so opening
// the address dialog doesn't block on it.
const LocationSelector = dynamic(
  () => import("@/components/common/LocationSelector").then((m) => m.LocationSelector),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2 h-10 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading location…
      </div>
    ),
  }
);

interface AddressFormValues {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressDialogProps {
  address?: any; // If provided, we are editing
  trigger?: React.ReactNode;
}

export function AddressDialog({ address, trigger }: AddressDialogProps) {
  const { createAddress, updateAddress } = useAddressStore();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormValues>({
    defaultValues: address || {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
      isDefault: false,
    },
  });

  const isDefault = watch("isDefault");

  const onSubmit = async (data: AddressFormValues) => {
    setIsLoading(true);
    try {
      if (address) {
        await updateAddress({ ...data, id: address.id });
      } else {
        await createAddress(data);
      }

      toast.success(address ? t("account.addresses.messages.updated") : t("account.addresses.messages.added"));
      setOpen(false);
      if (!address) reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t("account.common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="uppercase tracking-widest text-[10px] font-bold h-10 gap-2">
            <Plus className="w-4 h-4" /> {t("account.addresses.addNew")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="font-heading text-2xl">
            {address ? t("account.addresses.editTitle") : t("account.addresses.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto flex-1 pr-1">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest">{t("account.addresses.form.firstName")}</Label>
                <Input
                  id="firstName"
                  placeholder={t("account.addresses.form.placeholders.firstName")}
                  {...register("firstName", { required: t("account.addresses.form.validation.firstName") })}
                  className="border-muted-foreground/20"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest">{t("account.addresses.form.lastName")}</Label>
                <Input
                  id="lastName"
                  placeholder={t("account.addresses.form.placeholders.lastName")}
                  {...register("lastName", { required: t("account.addresses.form.validation.lastName") })}
                  className="border-muted-foreground/20"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-xs font-bold uppercase tracking-widest">{t("account.addresses.form.street")}</Label>
              <Input
                id="street"
                placeholder={t("account.addresses.form.placeholders.street")}
                {...register("street", { required: t("account.addresses.form.validation.street") })}
                className="border-muted-foreground/20"
              />
              {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
            </div>

            {/* Hidden inputs to register validation rules */}
            <input type="hidden" {...register("country", { required: t("account.addresses.form.validation.country") })} />
            <input type="hidden" {...register("state", { required: t("account.addresses.form.validation.state") })} />
            <input type="hidden" {...register("city", { required: t("account.addresses.form.validation.city") })} />
            <input type="hidden" {...register("zipCode", { required: t("account.addresses.form.validation.zipCode") })} />

            <LocationSelector
              values={{
                country: watch("country") || "India",
                state: watch("state") || "",
                city: watch("city") || "",
                zipCode: watch("zipCode") || "",
              }}
              onChange={(field, value) => setValue(field, value, { shouldValidate: true })}
              allowedCountries={["India"]}
              errors={{
                country: errors.country?.message,
                state: errors.state?.message,
                city: errors.city?.message,
                zipCode: errors.zipCode?.message,
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">{t("account.addresses.form.phone")}</Label>
              <Input
                id="phone"
                placeholder={t("account.addresses.form.placeholders.phone")}
                {...register("phone", { required: t("account.addresses.form.validation.phone") })}
                className="border-muted-foreground/20"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("isDefault", !!checked)}
                className="border-muted-foreground/30"
              />
              <Label htmlFor="isDefault" className="text-xs font-medium text-muted-foreground cursor-pointer">
                {t("account.addresses.form.setDefaultLabel")}
              </Label>
            </div>
          </div>

        </form>

        <DialogFooter className="shrink-0 pt-2 border-t border-border/30">
          <Button
            type="submit"
            form="address-form"
            disabled={isLoading}
            className="w-full uppercase tracking-widest text-xs font-bold h-12 gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            {address ? t("account.addresses.form.update") : t("account.addresses.form.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
