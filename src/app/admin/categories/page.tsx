"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
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
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/categoryStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { TablePagination } from "@/components/admin/TablePagination";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useTranslation } from "@/context/TranslationContext";
import { usePagination } from "@/hooks/usePagination";
import { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, totalCategories, isLoading, fetchCategories, deleteCategoryById, updateCategoryById } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  // State for Edit/Delete dialogs
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData: paginatedCategories,
    totalItems,
  } = usePagination({
    data: categories,
    totalItems: totalCategories,
    isServerSide: true,
    dependencies: [searchQuery],
  });

  useEffect(() => {
    fetchCategories(true, {
      page: currentPage,
      limit: pageSize,
      query: searchQuery,
    });
  }, [currentPage, pageSize, searchQuery, fetchCategories]);

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
        await deleteCategoryById(selectedCategory.id);
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        toast.success(t("admin.categories.messages.deleteSuccess"));
        router.refresh();
      } catch (err) {
        toast.error(t("admin.categories.messages.deleteError"));
      }
    }
  };

  const toggleArchive = async (cat: Category) => {
    try {
      const newStatus = cat.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";
      await updateCategoryById(cat.id, cat.name, newStatus);
      toast.success(newStatus === "ARCHIVED" ? t("admin.categories.messages.archiveSuccess") : t("admin.categories.messages.activateSuccess"));
      router.refresh();
    } catch (err) {
      toast.error(t("admin.categories.messages.statusError"));
    }
  };

  const columns: Column<Category>[] = [
    {
      header: t("admin.categories.table.collection"),
      render: (cat) => (
        <div className="flex items-center gap-3 py-2">
          {cat.image ?
            <img
              src={cat.image}
              alt={cat.name}
              className="w-12 h-16 object-cover rounded"
            /> :
            <div className="w-12 h-16 rounded bg-secondary/50 flex items-center justify-center font-bold text-primary">
              {cat.name.charAt(0)}
            </div>
          }
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
            {isArchived ? t("admin.categories.status.archived") : t("admin.categories.status.active")}
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
                      <ArchiveRestore className="w-4 h-4" /> {t("admin.categories.actions.activate")}
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4" /> {t("admin.categories.actions.archive")}
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
        data={paginatedCategories}
        isLoading={isLoading}
        emptyMessage={t("admin.categories.empty")}
        rowKey={(cat) => cat.id}
        mobileCard={(cat) => {
          const isArchived = cat.status === "ARCHIVED";
          return (
            <div className="bg-background border border-border/50 rounded-sm p-4 flex items-center gap-3">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-14 object-cover rounded-sm flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-14 rounded-sm bg-secondary/50 flex items-center justify-center font-bold text-primary flex-shrink-0">
                  {cat.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm tracking-tight truncate">{cat.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2 flex-shrink-0",
                      isArchived
                        ? "border-muted-foreground/30 text-muted-foreground bg-muted/5"
                        : "border-primary/30 text-primary bg-primary/5"
                    )}
                  >
                    {isArchived ? t("admin.categories.status.archived") : t("admin.categories.status.active")}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                  {cat._count?.products || 0} {t("admin.categories.table.products").toLowerCase()}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-background border border-border/50 shadow-xl z-[100]">
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); handleEdit(cat); }} className="gap-2 cursor-pointer">
                    <Edit2 className="w-4 h-4" /> {t("admin.products.actions.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.preventDefault(); toggleArchive(cat); }} className="gap-2 cursor-pointer">
                    {isArchived
                      ? <><ArchiveRestore className="w-4 h-4" /> Activate</>
                      : <><Archive className="w-4 h-4" /> Archive</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => { e.preventDefault(); handleDeleteClick(cat); }}
                    className="gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> {t("admin.products.actions.remove")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

      {/* Edit Category Dialog */}
      <CategoryDialog
        category={selectedCategory}
        open={isEditDialogOpen}
        onOpenChange={(val) => {
          setIsEditDialogOpen(val);
          if (!val) setTimeout(() => setSelectedCategory(null), 300);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={(val) => {
          setIsDeleteDialogOpen(val);
          if (!val) setTimeout(() => setSelectedCategory(null), 300);
        }}
        title={t("admin.categories.delete.title")}
        description={selectedCategory ? t("admin.categories.delete.description").replace("{name}", selectedCategory.name) : ""}
        onConfirm={confirmDelete}
        cancelText={t("admin.common.cancel")}
        confirmText={t("admin.common.delete")}
      />
    </div>
  );
}
