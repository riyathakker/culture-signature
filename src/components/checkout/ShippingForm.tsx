"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useAddressStore } from "@/store/addressStore";
import { useEffect } from "react";
import { MapPin, Loader2, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useTranslation } from "@/context/TranslationContext";
import { LocationSelector } from "@/components/common/LocationSelector";

export function ShippingForm() {
  const { t } = useTranslation();
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const { addresses: savedAddresses, isLoading, fetchAddresses } = useAddressStore();

  useEffect(() => {
    // Country is fixed to India for now.
    if (!shippingAddress.country) setShippingAddress({ country: "India" });
    fetchAddresses().then(() => {
      const defaultAddress = useAddressStore.getState().addresses.find((a) => a.isDefault);
      if (defaultAddress && !shippingAddress.street) handleSelectAddress(defaultAddress);
    });
  }, []);

  const handleSelectAddress = (addr: any) => {
    setShippingAddress({
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      country: addr.country || "India",
      phone: addr.phone || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Map IDs to store keys
    const fieldMap: Record<string, string> = {
      "first-name": "firstName",
      "last-name": "lastName",
      "address": "street",
      "city": "city",
      "state": "state",
      "zip": "zipCode",
      "phone": "phone"
    };
    const field = fieldMap[id];
    if (field) {
      setShippingAddress({ [field]: value });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-1">
        <div className="space-y-2">
          <h3 className="text-2xl font-heading">{t("cart.checkout.shipping.title")}</h3>
        </div>

        {savedAddresses.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="h-10 text-spaced-bold gap-2 border-primary/20 hover:border-primary">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                {t("cart.checkout.shipping.useSavedAddress")} <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-background border border-border/50 shadow-luxury p-2 z-[100]">
              <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-1.5 border-b border-border/50 mb-1">{t("cart.checkout.shipping.curatedAddresses")}</p>
              {savedAddresses.map((addr) => (
                <DropdownMenuItem
                  key={addr.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectAddress(addr);
                  }}
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-secondary/50 rounded-sm focus:bg-secondary/50 outline-none"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 opacity-40" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">{addr.firstName} {addr.lastName}</p>
                  </div>
                  <p className="text-[10px] text-primary font-medium">{addr.street}</p>
                  <p className="text-[9px] text-muted-foreground italic">{addr.city}, {addr.state} {addr.zipCode}</p>
                  {addr.isDefault && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">{t("cart.checkout.shipping.default")}</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-spaced-bold opacity-60">{t("cart.checkout.shipping.firstName")}</Label>
          <Input
            id="first-name"
            placeholder={t("cart.checkout.shipping.placeholders.firstName")}
            value={shippingAddress.firstName || ""}
            onChange={handleChange}
            className="rounded-md border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-spaced-bold opacity-60">{t("cart.checkout.shipping.lastName")}</Label>
          <Input
            id="last-name"
            placeholder={t("cart.checkout.shipping.placeholders.lastName")}
            value={shippingAddress.lastName || ""}
            onChange={handleChange}
            className="rounded-md border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address" className="text-spaced-bold opacity-60">{t("cart.checkout.shipping.streetAddress")}</Label>
          <Input
            id="address"
            placeholder={t("cart.checkout.shipping.placeholders.street")}
            value={shippingAddress.street || ""}
            onChange={handleChange}
            className="rounded-md border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <LocationSelector
            values={{
              country: shippingAddress.country || "India",
              state: shippingAddress.state || "",
              city: shippingAddress.city || "",
              zipCode: shippingAddress.zipCode || "",
            }}
            onChange={(field, value) => setShippingAddress({ [field]: value })}
            labelClassName="text-spaced-bold opacity-60"
            allowedCountries={["India"]}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="phone" className="text-spaced-bold opacity-60">{t("cart.checkout.shipping.phone")}</Label>
          <Input
            id="phone"
            placeholder={t("cart.checkout.shipping.placeholders.phone")}
            value={shippingAddress.phone || ""}
            onChange={handleChange}
            className="rounded-md border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
