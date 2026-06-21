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
import { LocationSelector } from "@/components/common/LocationSelector";

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

      toast.success(address ? "Address updated" : "Address added");
      setOpen(false);
      if (!address) reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button className="uppercase tracking-widest text-[10px] font-bold h-10 gap-2">
            <Plus className="w-4 h-4" /> Add New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            {address ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                  className="border-muted-foreground/20"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name is required" })}
                  className="border-muted-foreground/20"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-xs font-bold uppercase tracking-widest">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Luxury Lane"
                {...register("street", { required: "Street is required" })}
                className="border-muted-foreground/20"
              />
              {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
            </div>

            {/* Hidden inputs to register validation rules */}
            <input type="hidden" {...register("country", { required: "Country is required" })} />
            <input type="hidden" {...register("state", { required: "State is required" })} />
            <input type="hidden" {...register("city", { required: "City is required" })} />
            <input type="hidden" {...register("zipCode", { required: "Zip code is required" })} />

            <LocationSelector
              values={{
                country: watch("country") || "India",
                state: watch("state") || "",
                city: watch("city") || "",
                zipCode: watch("zipCode") || "",
              }}
              onChange={(field, value) => setValue(field, value, { shouldValidate: true })}
              errors={{
                country: errors.country?.message,
                state: errors.state?.message,
                city: errors.city?.message,
                zipCode: errors.zipCode?.message,
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 9876543210"
                {...register("phone", { required: "Phone number is required" })}
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
                Set as default address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full uppercase tracking-widest text-xs font-bold h-12 gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {address ? "Update Address" : "Save Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
