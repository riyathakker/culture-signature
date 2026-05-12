"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckoutStore } from "@/store/checkoutStore";
import { useEffect, useState } from "react";
import { MapPin, Loader2, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ShippingForm() {
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user/address");
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data);

          // If there's a default address, auto-fill it
          const defaultAddress = data.find((addr: any) => addr.isDefault);
          if (defaultAddress && !shippingAddress.street) {
            handleSelectAddress(defaultAddress);
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSelectAddress = (addr: any) => {
    console.log("Selecting address:", addr);
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
    // @ts-ignore
    if (window.toast) {
      // @ts-ignore
      window.toast.success("Address applied to form");
    } else {
      import("sonner").then(({ toast }) => toast.success("Address applied to form"));
    }
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-4">
          <h3 className="text-2xl font-heading">Shipping Information</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Where should we deliver your masterpiece?</p>
        </div>

        {savedAddresses.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="h-10 text-[10px] uppercase tracking-widest font-bold gap-2 border-primary/20 hover:border-primary">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                Use Saved Address <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-background border border-border/50 shadow-luxury p-2 z-[100]">
              <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground px-2 py-1.5 border-b border-border/50 mb-1">Your Curated Addresses</p>
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
                  {addr.isDefault && <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">DEFAULT</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-[10px] uppercase tracking-widest font-bold opacity-60">First Name</Label>
          <Input
            id="first-name"
            placeholder="John"
            value={shippingAddress.firstName || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-[10px] uppercase tracking-widest font-bold opacity-60">Last Name</Label>
          <Input
            id="last-name"
            placeholder="Doe"
            value={shippingAddress.lastName || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address" className="text-[10px] uppercase tracking-widest font-bold opacity-60">Street Address</Label>
          <Input
            id="address"
            placeholder="123 Luxury Lane"
            value={shippingAddress.street || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-[10px] uppercase tracking-widest font-bold opacity-60">City</Label>
          <Input
            id="city"
            placeholder="New York"
            value={shippingAddress.city || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-[10px] uppercase tracking-widest font-bold opacity-60">State / Province</Label>
          <Input
            id="state"
            placeholder="NY"
            value={shippingAddress.state || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip" className="text-[10px] uppercase tracking-widest font-bold opacity-60">ZIP / Postal Code</Label>
          <Input
            id="zip"
            placeholder="10001"
            value={shippingAddress.zipCode || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold opacity-60">Phone Number (For Delivery Updates)</Label>
          <Input
            id="phone"
            placeholder="+1 212 555 0123"
            value={shippingAddress.phone || ""}
            onChange={handleChange}
            className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Checkbox id="billing-same" defaultChecked className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
        <Label htmlFor="billing-same" className="text-xs text-muted-foreground font-serif italic cursor-pointer">
          Billing address is same as shipping
        </Label>
      </div>
    </div>
  );
}
