"use client";

import { IconButton } from "@/components/ui/IconButton";
import { X } from "lucide-react";

export function AnnouncementBar({ onClose }: { onClose: () => void }) {
  const message = "Complimentary Shipping on all orders over ₹5,000  •  New Collection Available Now  •  ";

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <div className="flex items-center">
        <div className="flex overflow-hidden py-2 min-w-0">
          <div className="flex w-max animate-marquee">
            <span className="text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap pr-8">
              {message}
            </span>
            <span className="text-xs md:text-sm font-medium tracking-wider uppercase whitespace-nowrap pr-8">
              {message}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 px-4">
          <IconButton
            icon={X}
            onClick={onClose}
            className="size-6 hover:bg-white/20"
            iconClassName="size-3 text-primary-foreground group-hover:text-primary-foreground"
            aria-label="Close announcement"
          />
        </div>
      </div>
    </div>
  );
}