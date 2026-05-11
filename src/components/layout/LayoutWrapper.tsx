"use client";

import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAnnouncementVisible } = useUIStore();
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith("/admin");

  return (
    <main className={cn(
      "flex-grow transition-all duration-500",
      (isAnnouncementVisible && !isAdminPanel) && "pt-[120px]",
    )}>
      {children}
    </main>
  );
}
