"use client";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  Search,
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
import { useState, useMemo } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { en } from "@/locales/en";

const t = en.admin.categories;

export default function CategoriesPage() {
  const { categories, isLoading, updateCategory, addCategory } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const columns: Column<any>[] = [
    {
      header: t.table.collection,
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
      header: t.table.slug,
      className: "font-mono text-[10px] text-muted-foreground",
      accessor: "slug",
    },
    {
      header: t.table.description,
      className: "max-w-[300px] truncate text-xs italic font-serif opacity-60",
      accessor: "description",
    },
    {
      header: t.table.products,
      headerClassName: "text-center",
      className: "text-center font-bold text-xs",
      render: (cat) => cat._count?.products || 0,
    },
    {
      header: t.table.status,
      render: (cat) => (
        <Badge
          variant="outline"
          className={`text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2 ${
            cat.isArchived 
              ? "border-muted-foreground/30 text-muted-foreground bg-muted/5" 
              : "border-primary/30 text-primary bg-primary/5"
          }`}
        >
          {cat.isArchived ? "Archived" : "Active"}
        </Badge>
      ),
    },
    {
      header: en.admin.common.actions,
      render: (cat) => (
        <div className="flex justify-center gap-2">
          <CategoryDialog
            category={cat}
            onSuccess={(updatedCat) => updateCategory(updatedCat)}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                <Edit2 className="w-4 h-4" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminPageHeader
        title={t.title}
        description={t.description}
        action={
          <CategoryDialog
            onSuccess={(newCat) => addCategory(newCat)}
            trigger={
              <Button className="btn-luxury px-6 gap-2">
                <Plus className="w-4 h-4" /> {t.newCategory}
              </Button>
            }
          />
        }
      />

      <AdminFilterBar
        searchPlaceholder={t.searchPlaceholder}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable
        columns={columns}
        data={filteredCategories}
        isLoading={isLoading}
        emptyMessage={t.empty}
        rowKey={(cat) => cat.id}
      />
    </div>
  );
}
