"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useDiscountStore } from "@/store/discountStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { DiscountDialog } from "@/components/admin/DiscountDialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { en } from "@/locales/en";

const t = en.admin.discounts;

export default function DiscountsPage() {
  const { discounts, isLoading, fetchDiscounts, deleteDiscount } = useDiscountStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  
  // State for Edit/Delete modals
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDiscounts(true); // Force fetch on mount
  }, []);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
      const matchesSearch = discount.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !activeStatus || discount.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [discounts, searchQuery, activeStatus]);

  const handleEdit = useCallback((discount: any) => {
    setSelectedDiscount(discount);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((discount: any) => {
    setSelectedDiscount(discount);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (selectedDiscount) {
      await deleteDiscount(selectedDiscount.id);
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    }
  };

  const columns: Column<any>[] = useMemo(() => [
    {
      header: t.table.code,
      render: (discount) => (
        <div className="flex items-center gap-2 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-mono text-sm font-bold tracking-wider">{discount.code}</span>
        </div>
      ),
    },
    {
      header: t.table.type,
      className: "text-xs uppercase tracking-widest font-bold text-muted-foreground",
      accessor: "type",
    },
    {
      header: t.table.value,
      headerClassName: "text-right",
      className: "text-right font-bold text-sm",
      render: (discount) => discount.type === "PERCENTAGE" ? `${discount.value}%` : `₹${discount.value.toLocaleString()}`,
    },
    {
      header: t.table.usage,
      headerClassName: "text-center",
      className: "text-center",
      render: (discount) => (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium">{discount.usageLimit ? `${discount.usedCount}/${discount.usageLimit}` : 'Unlimited'}</span>
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
      header: t.table.expires,
      className: "text-xs font-medium text-muted-foreground",
      render: (discount) => discount.expiryDate ? format(new Date(discount.expiryDate), "MMM dd, yyyy") : "Never",
    },
    {
      header: t.table.status,
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
        <div className="flex justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-background border border-border/50 shadow-xl z-[100]">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit(discount);
                }} 
                className="gap-2 cursor-pointer focus:bg-primary focus:text-primary-foreground"
              >
                <Edit2 className="w-4 h-4" /> {en.admin.products.actions.edit}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(discount);
                }} 
                className="gap-2 text-destructive cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" /> {en.admin.products.actions.remove}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [handleEdit, handleDeleteClick]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <AdminPageHeader
        title={t.title}
        description={t.description}
        action={<DiscountDialog />}
      />

      <AdminFilterBar
        searchPlaceholder={t.searchPlaceholder}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label={t.filters.status}
          icon={Filter}
          options={[
            { label: t.filters.active, value: "ACTIVE" },
            { label: t.filters.expired, value: "EXPIRED" }
          ]}
          selectedValue={activeStatus}
          onSelect={setActiveStatus}
          allLabel={t.filters.all}
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredDiscounts}
        isLoading={isLoading}
        emptyMessage={t.empty}
        rowKey={(d) => d.id}
      />

      {/* Edit Dialog - Outside the table loop */}
      <DiscountDialog 
        discount={selectedDiscount}
        open={isEditDialogOpen}
        onOpenChange={(val) => {
          setIsEditDialogOpen(val);
          if (!val) setTimeout(() => setSelectedDiscount(null), 300);
        }}
      />

      {/* Delete Confirmation - Outside the table loop */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(val) => {
          setIsDeleteDialogOpen(val);
          if (!val) setTimeout(() => setSelectedDiscount(null), 300);
        }}
        title={t.delete.title}
        description={selectedDiscount ? t.delete.description.replace("{code}", selectedDiscount.code) : ""}
        onConfirm={confirmDelete}
        cancelText={en.admin.common.cancel}
        confirmText={en.admin.common.delete}
      />
    </div>
  );
}
