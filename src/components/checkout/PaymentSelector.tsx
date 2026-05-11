"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PaymentSelector() {
  const [selected, setSelected] = useState("card");

  return (
    <div className="space-y-8 pt-10 border-t">
      <div className="space-y-4">
        <h3 className="text-2xl font-heading">Payment Method</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Secure and encrypted transactions</p>
      </div>

      <RadioGroup value={selected} onValueChange={setSelected} className="grid grid-cols-1 gap-4">
        {/* Credit Card */}
        <div className="relative">
          <RadioGroupItem value="card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className={cn(
              "flex items-center justify-between p-6 border rounded-sm cursor-pointer transition-all",
              selected === "card" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest">Credit or Debit Card</p>
                <p className="text-[10px] text-muted-foreground">Visa, Mastercard, American Express</p>
              </div>
            </div>
          </Label>
        </div>

        {/* Apple Pay / Digital Wallet */}
        <div className="relative">
          <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
          <Label
            htmlFor="wallet"
            className={cn(
              "flex items-center justify-between p-6 border rounded-sm cursor-pointer transition-all",
              selected === "wallet" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <Wallet className="w-6 h-6 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest">Digital Wallet</p>
                <p className="text-[10px] text-muted-foreground">Apple Pay, Google Pay</p>
              </div>
            </div>
          </Label>
        </div>

        {/* Boutique Financing */}
        <div className="relative">
          <RadioGroupItem value="finance" id="finance" className="peer sr-only" />
          <Label
            htmlFor="finance"
            className={cn(
              "flex items-center justify-between p-6 border rounded-sm cursor-pointer transition-all",
              selected === "finance" ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <Landmark className="w-6 h-6 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest">Boutique Financing</p>
                <p className="text-[10px] text-muted-foreground">Pay in monthly installments (APR applies)</p>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
