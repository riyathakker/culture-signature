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
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";

import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import { ROUTES } from "@/constants/routes";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

import { useTranslation } from "@/context/TranslationContext";

const EditableCell = ({
  productId,
  field,
  initialValue,
  onSave,
  className,
  renderValue
}: {
  productId: string;
  field: string;
  initialValue: any;
  onSave: (id: string, field: string, value: any) => Promise<void>;
  className?: string;
  renderValue?: (value: any) => React.ReactNode;
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  // Sync value with initialValue if it changes externally
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    if (parseFloat(value) === parseFloat(initialValue)) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    try {
      await onSave(productId, field, value);
      setIsEditing(false);
    } catch (error) {
      setValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn("flex justify-end w-full", className)}>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setValue(initialValue);
              setIsEditing(false);
            }
          }}
          autoFocus
          className="w-24 h-8 text-right bg-background border-primary/50"
          disabled={isLoading}
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer relative",
        className
      )}
      title={t("admin.products.doubleClick")}
    >
      <div className="group-hover:text-primary transition-colors">
        {renderValue ? renderValue(initialValue) : (field === 'price' ? `₹${initialValue.toLocaleString()}` : initialValue)}
      </div>
    </div>
  );
};

export default function AdminProducts() {
  const { t } = useTranslation();
  const { products, isLoading, fetchProducts, updateProductById, deleteProductById } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleInlineUpdate = async (id: string, field: string, value: any) => {
    try {
      const updatedValue = field === 'price' || field === 'stock' ? parseFloat(value) : value;
      await updateProductById(id, { [field]: updatedValue });
      toast.success(t("admin.products.messages.updateSuccess", { field: field.charAt(0).toUpperCase() + field.slice(1) }));
    } catch (error) {
      toast.error(t("admin.products.messages.updateError"));
      throw error;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());

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
      await deleteProductById(productToDelete);
      toast.success(t("admin.products.delete.success"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const updatedProduct = await updateProductById(id, { isFeatured: !currentFeatured });
      toast.success(updatedProduct.isFeatured ? t("admin.products.messages.featuredSuccess") : t("admin.products.messages.unfeaturedSuccess"));
    } catch (error) {
      toast.error(t("admin.products.messages.updateError"));
    }
  };

  const columns: Column<any>[] = [
    {
      header: t("admin.products.columns.product"),
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
      header: `${t("admin.products.columns.price")} (₹)`,
      headerClassName: "text-right",
      className: "text-right",
      render: (product) => (
        <EditableCell
          productId={product.id}
          field="price"
          initialValue={product.price}
          onSave={handleInlineUpdate}
          className="text-right font-medium"
        />
      ),
    },
    {
      header: `${t("admin.products.columns.discount")} (₹)`,
      headerClassName: "text-right",
      className: "text-right",
      render: (product) => (
        <EditableCell
          productId={product.id}
          field="discount"
          initialValue={product.discount}
          onSave={handleInlineUpdate}
          className="text-right font-medium"
        />
      ),
    },
    {
      header: t("admin.products.columns.stock"),
      headerClassName: "text-center",
      className: "text-center",
      render: (product) => (
        <EditableCell
          productId={product.id}
          field="stock"
          initialValue={product.stock}
          onSave={handleInlineUpdate}
          className="text-center font-bold"
          renderValue={(val) => {
            const isOutOfStock = val === 0;
            const isLowStock = val > 0 && val <= 5;
            return (
              <span className={cn(
                isOutOfStock ? "text-destructive" :
                  isLowStock ? "text-amber-500" :
                    "text-foreground"
              )}>
                {val}
              </span>
            );
          }}
        />
      ),
    },
    {
      header: t("admin.products.columns.featured"),
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
      header: t("admin.products.columns.status"),
      render: (product) => {
        const isOutOfStock = product.stock === 0;
        const isLowStock = product.stock > 0 && product.stock <= 5;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] tracking-[0.15em] font-bold h-5 uppercase rounded-none px-2",
              isOutOfStock ? "border-destructive text-destructive bg-destructive/5" : "border-success text-success bg-success/5",
              isLowStock ? "border-amber-500 text-amber-500 bg-amber-500/5" : "border-success text-success bg-success/5"
            )}
          >
            {isOutOfStock ? t("admin.products.status.outOfStock") : isLowStock ? t("admin.products.status.lowStock") : t("admin.products.status.inStock")}
          </Badge>
        );
      },
    },
    {
      header: t("admin.products.columns.created"),
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
                <Edit2 className="w-4 h-4" /> {t("admin.products.actions.edit")}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={() => handleDeleteClick(product.id)}
            >
              <Trash2 className="w-4 h-4" /> {t("admin.products.actions.remove")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <AdminPageHeader
        title={t("admin.products.title")}
        description={t("admin.products.description")}
        action={
          <Link href={ROUTES.ADMIN.PRODUCTS_NEW}>
            <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> {t("admin.products.newProduct")}
            </Button>
          </Link>
        }
      />

      <AdminFilterBar
        searchPlaceholder={t("admin.products.searchPlaceholder")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label={t("admin.products.categories.label")}
          icon={Filter}
          options={categories.map(c => ({ label: c.name, value: c.id }))}
          selectedValue={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          allLabel={t("admin.products.categories.all")}
        />
        <AdminFilterDropdown
          label={t("admin.products.columns.status")}
          icon={Activity}
          options={[
            { label: t("admin.products.status.lowStock"), value: "LOW_STOCK" },
            { label: t("admin.products.status.outOfStock"), value: "OUT_OF_STOCK" }
          ]}
          selectedValue={activeStatus}
          onSelect={setActiveStatus}
          allLabel={t("admin.products.status.allStock")}
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        emptyMessage={t("admin.products.noResults")}
        rowKey={(p) => p.id}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteProduct}
        title={t("admin.products.delete.title")}
        description={t("admin.products.delete.description")}
        confirmText={t("admin.products.delete.confirm")}
        variant="destructive"
      />
    </div>
  );
}
