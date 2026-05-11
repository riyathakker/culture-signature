"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  Activity
} from "lucide-react";
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
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewDiscountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    usageLimit: "",
    expiryDate: "",
    status: "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create discount");
      }

      toast.success("Privilege created successfully.");
      router.push("/admin/discounts");
      router.refresh();
    } catch (error) {
      toast.error("Could not create the promotional offer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/discounts">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-heading tracking-tight">Create Privilege</h1>
            <p className="text-muted-foreground font-serif italic text-sm">Design an exclusive offer for your patrons.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border/30 pb-4">
              <Tag className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Offer Details</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Coupon Code</Label>
                <Input
                  placeholder="e.g., ROYAL20"
                  className="h-12 rounded-none border-border/50 font-mono tracking-wider uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
                <p className="text-[10px] text-muted-foreground italic">Patrons will enter this code at checkout.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger className="h-12 rounded-none border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">
                        <div className="flex items-center gap-2">
                          <Percent className="w-3 h-3" /> Percentage
                        </div>
                      </SelectItem>
                      <SelectItem value="FIXED">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-3 h-3" /> Fixed Amount
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold">Value</Label>
                  <Input
                    type="number"
                    placeholder={formData.type === "PERCENTAGE" ? "20" : "500"}
                    className="h-12 rounded-none border-border/50"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Limits & Expiry */}
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border/30 pb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Validity & Scope</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Usage Limit</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    className="h-12 pl-10 rounded-none border-border/50"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold">Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="h-12 pl-10 rounded-none border-border/50"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>Create
        </div>

        <div className="space-y-6">
          <div className="bg-background border border-border/50 p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border/30 pb-4">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Publishing</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="h-12 rounded-none border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full h-12 uppercase tracking-[0.2em] text-[10px] font-bold"
                disabled={isLoading}
              >
                {isLoading ? "Curating..." : "Create Offer"}
                <Save className="w-4 h-4 ml-2" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 uppercase tracking-[0.2em] text-[10px] font-bold border-border/50"
                onClick={() => router.push("/admin/discounts")}
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="p-6 bg-secondary/20 border border-border/30 rounded-sm italic text-[11px] text-muted-foreground font-serif">
            Note: Once created, coupon codes are unique identifiers for your promotions and should be handled with care to maintain the house's exclusivity.
          </div>
        </div>
      </form>
    </div>
  );
}
