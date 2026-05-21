"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, MoreVertical, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { TablePagination } from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "w-3 h-3",
            s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget }),
      });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget));
      toast.success("Review removed");
    } catch {
      toast.error("Failed to remove review");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      !searchQuery ||
      r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRating = !ratingFilter || r.rating === Number(ratingFilter);
    return matchSearch && matchRating;
  });

  const { currentPage, pageSize, setCurrentPage, setPageSize, paginatedData, totalItems } =
    usePagination({ data: filtered, totalItems: filtered.length });

  const ratingOptions = [
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  const columns: Column<any>[] = [
    {
      accessor: "product",
      header: "Product",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm overflow-hidden bg-secondary/30 shrink-0">
            {r.product?.images?.[0] && (
              <img src={r.product.images[0]} alt={r.product.name} className="w-full h-full object-cover" />
            )}
          </div>
          <span className="text-xs font-medium truncate max-w-[140px]">{r.product?.name || "—"}</span>
        </div>
      ),
    },
    {
      accessor: "customer",
      header: "Customer",
      render: (r) => (
        <div>
          <p className="text-xs font-medium">{r.user?.name || "Anonymous"}</p>
          <p className="text-[10px] text-muted-foreground">{r.user?.email || ""}</p>
        </div>
      ),
    },
    {
      accessor: "rating",
      header: "Rating",
      render: (r) => (
        <div className="space-y-1">
          <StarRating rating={r.rating} />
          <span className="text-[10px] text-muted-foreground">{r.rating}/5</span>
        </div>
      ),
    },
    {
      accessor: "comment",
      header: "Review",
      render: (r) => (
        <p className="text-xs text-muted-foreground italic max-w-[260px] line-clamp-2">
          {r.comment || <span className="opacity-40">No comment</span>}
        </p>
      ),
    },
    {
      accessor: "date",
      header: "Date",
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(r.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
  ];

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <AdminPageHeader
        title="Customer Reviews"
        description="Monitor and moderate reviews left by your customers."
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reviews", value: reviews.length },
          { label: "Avg Rating", value: avgRating },
          { label: "5-Star", value: reviews.filter((r) => r.rating === 5).length },
        ].map((s) => (
          <div key={s.label} className="bg-background border border-border/50 rounded-sm p-4 space-y-1">
            <p className="text-spaced-bold text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-heading">{s.value}</p>
          </div>
        ))}</div>

      <AdminFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by product, customer, or review..."
      >
        <AdminFilterDropdown
          label="Rating"
          selectedValue={ratingFilter}
          options={ratingOptions}
          onSelect={setRatingFilter}
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={paginatedData}
        isLoading={isLoading}
        emptyMessage="No reviews found."
        rowKey={(r) => r.id}
        mobileCard={(r) => (
          <div className="bg-background border border-border/50 rounded-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-sm overflow-hidden bg-secondary/30 shrink-0">
                  {r.product?.images?.[0] && (
                    <img src={r.product.images[0]} alt={r.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{r.product?.name || "—"}</p>
                  <p className="text-[10px] text-muted-foreground">{r.user?.name || "Anonymous"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StarRating rating={r.rating} />
              </div>
            </div>

            {r.comment && (
              <p className="text-xs text-muted-foreground italic border-l-2 border-border pl-3 line-clamp-3">
                "{r.comment}"
              </p>
            )}

            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="uppercase tracking-widest">{format(new Date(r.createdAt), "dd MMM yyyy")}</span>
              <Badge variant="outline" className="text-[9px] font-bold h-4 px-1.5">
                {r.rating} / 5
              </Badge>
            </div>
          </div>
        )}
      />

      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <ConfirmationDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Review"
        description="This review will be permanently hidden from the product page. This cannot be undone."
        confirmText="Remove"
        variant="destructive"
      />
    </div>
  );
}
