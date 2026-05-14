"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface AdminFilterDropdownProps {
  label: string;
  icon: LucideIcon;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  allLabel?: string;
}

export function AdminFilterDropdown({
  label,
  icon: Icon,
  options,
  selectedValue,
  onSelect,
  allLabel = "All",
}: AdminFilterDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="h-12 px-6 uppercase tracking-widest text-[10px] font-bold border-border/50 gap-2 min-w-[140px]">
          <Icon className="w-4 h-4" /> 
          {selectedOption ? selectedOption.label : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-y-auto">
        <DropdownMenuItem onClick={() => onSelect("")} className="uppercase text-[10px] font-bold tracking-widest">
          {allLabel}
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onSelect(opt.value)}
            className="uppercase text-[10px] font-bold tracking-widest"
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
