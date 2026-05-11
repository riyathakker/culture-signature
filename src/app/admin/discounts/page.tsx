"use client";

import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useDiscountStore } from "@/store/discountStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

export default function DiscountsPage() {
  const { discounts, isLoading, fetchDiscounts } = useDiscountStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      const matchesSearch = discount.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !activeStatus || discount.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchQuery, activeStatus]);

  const columns: Column<any>[] = [
    {
      header: "Coupon Code",
      render: (discount) => (
        <div className="flex items-center gap-2 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-mono text-sm font-bold tracking-wider">{discount.code}</span>
        </div>
      ),
    },
    {
      header: "Type",
      className: "text-xs uppercase tracking-widest font-bold text-muted-foreground",
      accessor: "type",
    },
    {
      header: "Value",
      headerClassName: "text-right",
      className: "text-right font-bold text-sm",
      render: (discount) => discount.type === "PERCENTAGE" ? `${discount.value}%` : `₹${discount.value.toLocaleString()}`,
    },
    {
      header: "Usage",
      headerClassName: "text-center",
      className: "text-center",
      render: (discount) => (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium">{discount.usedCount}/{discount.usageLimit || "∞"}</span>
          <div className="w-20 h-1 bg-secondary/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: discount.usageLimit
                  ? `${(discount.usedCount / discount.usageLimit) * 100}%`
                  : "0%"
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Expires",
      className: "text-xs font-medium text-muted-foreground",
      render: (discount) => discount.expiryDate ? format(new Date(discount.expiryDate), "MMM dd, yyyy") : "Never",
    },
    {
      header: "Status",
      render: (discount) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2",
            discount.status === "ACTIVE" ? "border-green-500 text-green-500 bg-green-500/5" :
              discount.status === "SCHEDULED" ? "border-blue-500 text-blue-500 bg-blue-500/5" :
                "border-red-500 text-red-500 bg-red-500/5"
          )}
        >
          {discount.status}
        </Badge>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (discount) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Edit2 className="w-4 h-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
              <Trash2 className="w-4 h-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <AdminPageHeader
        title="Privileges & Offers"
        description="Curate exclusive experiences for your clientele."
        action={
          <Link href="/admin/discounts/new">
            <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />  New Offer
            </Button>
          </Link>
        }
      />

      <AdminFilterBar
        searchPlaceholder="Search coupon codes..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Status"
          icon={Filter}
          options={[
            { label: "Active", value: "ACTIVE" },
            { label: "Expired", value: "EXPIRED" }
          ]}
          selectedValue={activeStatus}
          onSelect={setActiveStatus}
          allLabel="All Status"
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredDiscounts}
        isLoading={isLoading}
        emptyMessage="No promotional offers match your criteria."
        rowKey={(d) => d.id}
      />
    </div>
  );
}
