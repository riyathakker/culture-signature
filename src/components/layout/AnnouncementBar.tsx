"use client";

import { IconButton } from "@/components/ui/IconButton";
import { X } from "lucide-react";

export function AnnouncementBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center relative">
        <p className="text-xs md:text-sm font-medium tracking-wider uppercase text-center">
          Complimentary Shipping on all orders over ₹50,000 • New Collection Available Now
        </p>
        <IconButton 
          icon={X} 
          onClick={onClose} 
          className="absolute right-4 size-6 hover:bg-white/20" 
          iconClassName="size-3 text-primary-foreground group-hover:text-primary-foreground" 
          aria-label="Close announcement" 
        />
      </div>
    </div>
  );
}
