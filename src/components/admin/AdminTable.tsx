"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

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
}

export function AdminTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  rowKey,
  expandable,
}: AdminTableProps<T>) {
  return (
    <div className="bg-background border border-border/50 rounded-sm overflow-hidden relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
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
                  <TableRow className={`hover:bg-secondary/5 transition-colors ${isExpanded ? 'bg-secondary/10' : ''}`}>
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
  );
}

import React from "react";
