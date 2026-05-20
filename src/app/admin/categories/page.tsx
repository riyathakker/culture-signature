"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/categoryStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useTranslation } from "@/context/TranslationContext";
import { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, isLoading, fetchCategories, updateCategory, addCategory, deleteCategory } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  // State for Edit/Delete dialogs
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories(true); // Force fetch on mount including archived
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleEdit = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        const response = await fetch(`/api/admin/categories?id=${selectedCategory.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        deleteCategory(selectedCategory.id);
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        toast.success("Collection removed successfully");
        router.refresh();
      } catch (err) {
        toast.error("Failed to delete collection");
      }
    }
  };

  const toggleArchive = async (cat: Category) => {
    try {
      const newStatus = cat.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cat.id,
          name: cat.name,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle category status");
      }

      const updated = await response.json();
      updateCategory(updated);
      toast.success(newStatus === "ARCHIVED" ? "Collection archived successfully" : "Collection activated successfully");
      router.refresh();
    } catch (err) {
      toast.error("Failed to change collection status");
    }
  };

  const columns: Column<Category>[] = [
    {
      header: t("admin.categories.table.collection"),
      render: (cat) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded bg-secondary/50 flex items-center justify-center font-bold text-primary">
            {cat.name.charAt(0)}
          </div>
          <span className="font-bold text-sm tracking-tight">{cat.name}</span>
        </div>
      ),
    },
    {
      header: t("admin.categories.table.products"),
      headerClassName: "text-center",
      className: "text-center font-bold text-xs",
      render: (cat) => cat._count?.products || 0,
    },
    {
      header: t("admin.categories.table.status"),
      render: (cat) => {
        const isArchived = cat.status === "ARCHIVED";
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2",
              isArchived
                ? "border-muted-foreground/30 text-muted-foreground bg-muted/5"
                : "border-primary/30 text-primary bg-primary/5"
            )}
          >
            {isArchived ? "Archived" : "Active"}
          </Badge>
        );
      },
    },
    {
      header: "",
      className: "text-right",
      render: (cat) => {
        const isArchived = cat.status === "ARCHIVED";
        return (
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-background border border-border/50 shadow-xl z-[100]">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(cat);
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" /> {t("admin.products.actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    toggleArchive(cat);
                  }}
                  className="gap-2 cursor-pointer"
                >
                  {isArchived ? (
                    <>
                      <ArchiveRestore className="w-4 h-4" /> Activate
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4" /> Archive
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(cat);
                  }}
                  className="gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {t("admin.products.actions.remove")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <AdminPageHeader
        title={t("admin.categories.title")}
        description={t("admin.categories.description")}
        action={
          <CategoryDialog
            onSuccess={(newCat: Category) => addCategory(newCat)}
          />
        }
      />

      <AdminFilterBar
        searchPlaceholder={t("admin.categories.searchPlaceholder")}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable
        columns={columns}
        data={filteredCategories}
        isLoading={isLoading}
        emptyMessage={t("admin.categories.empty")}
        rowKey={(cat) => cat.id}
      />

      {/* Edit Category Dialog */}
      <CategoryDialog
        category={selectedCategory}
        open={isEditDialogOpen}
        onOpenChange={(val) => {
          setIsEditDialogOpen(val);
          if (!val) setTimeout(() => setSelectedCategory(null), 300);
        }}
        onSuccess={(updatedCat: Category) => updateCategory(updatedCat)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(val) => {
          setIsDeleteDialogOpen(val);
          if (!val) setTimeout(() => setSelectedCategory(null), 300);
        }}
        title="Remove Collection"
        description={selectedCategory ? `Are you sure you want to remove the collection "${selectedCategory.name}"? This will soft-delete the category.` : ""}
        onConfirm={confirmDelete}
        cancelText={t("admin.common.cancel")}
        confirmText={t("admin.common.delete")}
      />
    </div>
  );
}
