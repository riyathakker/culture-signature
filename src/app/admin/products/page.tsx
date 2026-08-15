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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ImageLightbox } from "@/components/common/ImageLightbox";
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
import { TablePagination } from "@/components/admin/TablePagination";

import { useTranslation } from "@/context/TranslationContext";
import { usePagination } from "@/hooks/usePagination";
import { Category } from "@/types";

function MobileEditField({ value, onSave }: { value: number; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = async () => {
    setEditing(false);
    if (parseFloat(draft) !== parseFloat(String(value))) {
      try { await onSave(draft); } catch { setDraft(String(value)); }
    }
  };

  if (editing) return (
    <input
      autoFocus type="number" value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(String(value)); setEditing(false); } }}
      className="w-14 h-5 text-xs text-center border-b border-primary bg-transparent outline-none font-semibold"
    />
  );
  return (
    <button type="button" onClick={() => setEditing(true)} className="text-xs font-semibold hover:text-primary transition-colors">
      {value?.toLocaleString()}
    </button>
  );
}

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
      data-no-row-click
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
  const router = useRouter();
  const { products, totalProducts, isLoading, fetchProducts, updateProductById, deleteProductById } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData: paginatedProducts,
    totalItems,
  } = usePagination({
    data: products,
    totalItems: totalProducts,
    isServerSide: true,
    dependencies: [searchQuery, selectedCategoryId, activeStatus],
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(true, {
      page: currentPage,
      limit: pageSize,
      query: searchQuery,
      categoryId: selectedCategoryId,
      status: activeStatus,
    });
  }, [currentPage, pageSize, searchQuery, selectedCategoryId, activeStatus, fetchProducts]);

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
          {product.images?.[0] ? (
            <ImageLightbox
              src={product.images[0]}
              alt={product.name}
              images={product.images}
              className="w-12 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0"
              imgClassName="w-full h-full object-cover"
            />
          ) : (
            <div className="w-12 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
              <Package className="w-4 h-4 text-muted-foreground/40" />
            </div>
          )}
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title={t("admin.products.actions.remove")}
          onClick={() => handleDeleteClick(product.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <AdminPageHeader
        title={t("admin.products.title")}
        description={t("admin.products.description")}
        action={
          <div className="flex items-center gap-3">
            <Link href={ROUTES.ADMIN.PRODUCTS_BULK}>
              <Button variant="outline" className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-6 border-border/60">
                <Plus className="w-4 h-4 mr-2 hidden sm:inline-block" />  {t("admin.products.bulkUpload")}
              </Button>
            </Link>
            <Link href={ROUTES.ADMIN.PRODUCTS_NEW}>
              <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 shadow-xl shadow-primary/20">
                <Plus className="w-4 h-4 mr-2 hidden sm:inline-block" /> {t("admin.products.newProduct")}
              </Button>
            </Link>
          </div>
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
        data={paginatedProducts}
        isLoading={isLoading}
        emptyMessage={t("admin.products.noResults")}
        rowKey={(p) => p.id}
        onRowClick={(p) => router.push(ROUTES.ADMIN.PRODUCTS_EDIT(p.id))}
        mobileCard={(product) => {
          const outOfStock = product.stock === 0;
          const lowStock = product.stock > 0 && product.stock <= 5;
          const stockCls = outOfStock
            ? "border-destructive text-destructive bg-destructive/5"
            : lowStock ? "border-amber-500 text-amber-500 bg-amber-500/5"
              : "border-success text-success bg-success/5";
          const stockLabel = outOfStock ? t("admin.products.status.outOfStock")
            : lowStock ? t("admin.products.status.lowStock")
              : t("admin.products.status.inStock");
          return (
            <div className="bg-background border border-border/50 rounded-sm p-3 flex gap-3">
              {product.images?.[0] ? (
                <ImageLightbox
                  src={product.images[0]}
                  alt={product.name}
                  images={product.images}
                  className="w-12 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0"
                  imgClassName="w-full h-full object-cover"
                />
              ) : (
                <div className="w-12 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="font-bold text-sm tracking-tight truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{(product.category as Category)?.name || "Uncategorized"}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1 flex-shrink-0">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <Link href={ROUTES.ADMIN.PRODUCTS_EDIT(product.id)}>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit2 className="w-4 h-4" /> {t("admin.products.actions.edit")}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={() => handleDeleteClick(product.id)}>
                        <Trash2 className="w-4 h-4" /> {t("admin.products.actions.remove")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center divide-x divide-border/50 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5 pr-3">₹<MobileEditField value={product.price} onSave={(v) => handleInlineUpdate(product.id, "price", v)} /></span>
                  <span className="flex items-center gap-0.5 px-3">−₹<MobileEditField value={product.discount} onSave={(v) => handleInlineUpdate(product.id, "discount", v)} /></span>
                  <span className="flex items-center gap-0.5 pl-3">Stock <MobileEditField value={product.stock} onSave={(v) => handleInlineUpdate(product.id, "stock", v)} /></span>
                </div>
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("admin.products.columns.featured")}</span>
                    <Switch checked={product.isFeatured} onCheckedChange={() => toggleFeatured(product.id, product.isFeatured)} />
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
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
