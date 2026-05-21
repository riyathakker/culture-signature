"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function TablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Items count description */}
      <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
        Showing <span className="font-semibold text-foreground">{startIdx}</span> to{" "}
        <span className="font-semibold text-foreground">{endIdx}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
        {/* Page size selector (optional) */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px] border-border/50 text-xs bg-background/50">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm border-border/50 bg-background/50 hover:bg-secondary/50 text-muted-foreground disabled:opacity-40"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="w-4.5 h-4.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm border-border/50 bg-background/50 hover:bg-secondary/50 text-muted-foreground disabled:opacity-40"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </Button>

          {/* Current Page Indicator */}
          <div className="text-xs text-muted-foreground font-semibold px-2 min-w-[60px] text-center">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm border-border/50 bg-background/50 hover:bg-secondary/50 text-muted-foreground disabled:opacity-40"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm border-border/50 bg-background/50 hover:bg-secondary/50 text-muted-foreground disabled:opacity-40"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
