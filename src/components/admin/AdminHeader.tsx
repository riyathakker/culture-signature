"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
  return (
    <header className="h-20 bg-background border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders, products..." 
            className="pl-10 h-10 bg-secondary/20 border-none rounded-none focus-visible:ring-primary uppercase text-[10px] tracking-widest font-bold"
          />
        </div>
      </div>
    </header>
  );
}
