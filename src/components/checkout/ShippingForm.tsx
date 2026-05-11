"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function ShippingForm() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-heading">Shipping Information</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Where should we deliver your masterpiece?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first-name" className="text-[10px] uppercase tracking-widest font-bold">First Name</Label>
          <Input id="first-name" placeholder="John" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name" className="text-[10px] uppercase tracking-widest font-bold">Last Name</Label>
          <Input id="last-name" placeholder="Doe" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address" className="text-[10px] uppercase tracking-widest font-bold">Street Address</Label>
          <Input id="address" placeholder="123 Luxury Lane" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartment" className="text-[10px] uppercase tracking-widest font-bold">Apartment, Suite (Optional)</Label>
          <Input id="apartment" placeholder="Penthouse A" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-[10px] uppercase tracking-widest font-bold">City</Label>
          <Input id="city" placeholder="New York" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-[10px] uppercase tracking-widest font-bold">State / Province</Label>
          <Input id="state" placeholder="NY" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip" className="text-[10px] uppercase tracking-widest font-bold">ZIP / Postal Code</Label>
          <Input id="zip" placeholder="10001" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold">Phone Number (For Delivery Updates)</Label>
          <Input id="phone" placeholder="+1 212 555 0123" className="rounded-none border-muted-foreground/30 h-12 focus-visible:ring-primary" />
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
