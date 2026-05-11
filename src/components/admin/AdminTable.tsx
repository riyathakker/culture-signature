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
}

export function AdminTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  rowKey,
}: AdminTableProps<T>) {
  return (
    <div className="bg-background border border-border/50 rounded-sm overflow-hidden relative min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <Table>
        <TableHeader className="bg-secondary/20">
          <TableRow>
            {columns.map((column, idx) => (
              <TableHead 
                key={idx} 
                className={`text-[10px] uppercase tracking-widest font-bold h-14 ${column.headerClassName || ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground font-serif italic">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={rowKey(item)} className="hover:bg-secondary/5 transition-colors">
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
