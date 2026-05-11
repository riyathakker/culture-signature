"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface AdminFilterBarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  children?: ReactNode;
}

export function AdminFilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  children,
}: AdminFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder={searchPlaceholder} 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-background border-border/50 focus-visible:ring-primary rounded-none uppercase text-[10px] tracking-widest font-bold"
        />
      </div>
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );
}
