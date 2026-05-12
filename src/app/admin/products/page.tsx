"use client";

import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Package,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { ROUTES } from "@/constants/routes";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

export default function AdminProducts() {
  const { products, isLoading, fetchProducts, deleteProduct: storeDeleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;

      const matchesStatus = !activeStatus || (
        activeStatus === "OUT_OF_STOCK" ? product.stock === 0 :
          activeStatus === "LOW_STOCK" ? (product.stock > 0 && product.stock < 5) : true
      );

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategoryId, activeStatus]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/admin/products/${productToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      storeDeleteProduct(productToDelete);
      toast.success("Masterpiece removed from the catalog.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedProduct = await response.json();
      useProductStore.getState().updateProduct(updatedProduct);
      toast.success(updatedProduct.isFeatured ? "Marked as Featured" : "Removed from Featured");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-12 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm tracking-tight">{product.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.category?.name || "Uncategorized"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      headerClassName: "text-right",
      className: "text-right font-medium",
      render: (product) => `₹${product.price.toLocaleString()}`,
    },
    {
      header: "Discount",
      headerClassName: "text-right",
      className: "text-right font-medium",
      render: (product) => `${product.discount.toLocaleString()}`,
    },
    {
      header: "Stock",
      headerClassName: "text-center",
      className: "text-center",
      render: (product) => {
        const isOutOfStock = product.stock === 0;
        const isLowStock = product.stock > 0 && product.stock <= 5;
        return (
          <div className="flex flex-col items-center gap-1">
            <span className={cn("text-xs font-bold", isOutOfStock ? "text-destructive" : isLowStock ? "text-amber-500" : "text-foreground")}>
              {product.stock}
            </span>
          </div>
        );
      },
    },
    {
      header: "Featured",
      headerClassName: "text-center",
      className: "text-center",
      render: (product) => (
        <div className="flex justify-center">
          <Switch
            checked={product.isFeatured}
            onCheckedChange={() => toggleFeatured(product.id, product.isFeatured)}
          />
        </div>
      ),
    },
    {
      header: "Status",
      render: (product) => {
        const isOutOfStock = product.stock === 0;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] tracking-[0.15em] font-bold h-5 uppercase rounded-none px-2",
              isOutOfStock ? "border-destructive text-destructive bg-destructive/5" : "border-primary/30 text-primary bg-primary/5"
            )}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </Badge>
        );
      },
    },
    {
      header: "Created",
      className: "text-muted-foreground text-xs",
      render: (product) => format(new Date(product.createdAt), "MMM dd, yyyy"),
    },
    {
      header: "",
      className: "text-right",
      render: (product) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/50">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <Link href={ROUTES.ADMIN.PRODUCTS_EDIT(product.id)}>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Edit2 className="w-4 h-4" /> Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={() => handleDeleteClick(product.id)}
            >
              <Trash2 className="w-4 h-4" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <AdminPageHeader
        title="Artisanal Catalog"
        description="Curate and manage your collection of timeless masterpieces."
        action={
          <Link href={ROUTES.ADMIN.PRODUCTS_NEW}>
            <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Product
            </Button>
          </Link>
        }
      />

      <AdminFilterBar
        searchPlaceholder="Search masterpieces..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Categories"
          icon={Filter}
          options={categories.map(c => ({ label: c.name, value: c.id }))}
          selectedValue={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          allLabel="All Categories"
        />
        <AdminFilterDropdown
          label="Stock Status"
          icon={Activity}
          options={[
            { label: "Low Stock", value: "LOW_STOCK" },
            { label: "Out of Stock", value: "OUT_OF_STOCK" }
          ]}
          selectedValue={activeStatus}
          onSelect={setActiveStatus}
          allLabel="All Stock"
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        emptyMessage="No masterpieces match your current search criteria."
        rowKey={(p) => p.id}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteProduct}
        title="Remove Masterpiece"
        description="Are you sure you want to remove this product from the catalog? This action cannot be undone."
        confirmText="Remove"
        variant="destructive"
      />
    </div>
  );
}
