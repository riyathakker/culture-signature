"use client";

import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowKey: (item: T) => string;
  expandable?: {
    expandedRows: string[];
    renderExpanded: (item: T) => ReactNode;
  };
  mobileCard?: (item: T) => ReactNode;
  onRowClick?: (item: T) => void;
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
}

export function AdminTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  rowKey,
  expandable,
  mobileCard,
  onRowClick,
}: AdminTableProps<T>) {
  const handleRowClick = (item: T) => (e: React.MouseEvent) => {
    if (!onRowClick) return;
    if ((e.target as HTMLElement).closest("button, a, input, label, [role='switch'], [data-no-row-click]")) {
      return;
    }
    onRowClick(item);
  };
  return (
    <>
      {mobileCard && (
        <div className="sm:hidden relative min-h-[200px]">
          {isLoading && <LoadingOverlay />}
          {data.length === 0 && !isLoading ? (
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground italic">
              {emptyMessage}
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((item) => (
                <React.Fragment key={rowKey(item)}>
                  {mobileCard(item)}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={mobileCard ? "hidden sm:block" : undefined}>
        <div className="bg-background border border-border/50 rounded-sm overflow-hidden relative min-h-[400px]">
          {isLoading && <LoadingOverlay />}
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                {columns.map((column, idx) => (
                  <TableHead
                    key={idx}
                    className={`text-spaced-bold h-14 ${column.headerClassName || ""}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center muted-italic">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => {
                  const key = rowKey(item);
                  const isExpanded = expandable?.expandedRows.includes(key);

                  return (
                    <React.Fragment key={key}>
                      <TableRow
                        onClick={handleRowClick(item)}
                        className={`hover:bg-secondary/5 transition-colors ${isExpanded ? "bg-secondary/10" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                      >
                        {columns.map((column, idx) => (
                          <TableCell key={idx} className={column.className}>
                            {column.render
                              ? column.render(item)
                              : column.accessor
                                ? (item[column.accessor] as ReactNode)
                                : null}
                          </TableCell>
                        ))}
                      </TableRow>
                      {isExpanded && expandable && (
                        <TableRow className="hover:bg-transparent border-none">
                          <TableCell colSpan={columns.length} className="p-0 border-none">
                            {expandable.renderExpanded(item)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
