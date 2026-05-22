"use client";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Logo } from "../layout/navbar/Logo";

export function PWAHomeHeader() {
  return (
    /* shown only in PWA standalone mode via CSS */
    <div className="pwa-home-header hidden fixed top-0 left-0 right-0 z-40 flex-col">
      <AnnouncementBar />
      <div className="bg-background border-b border-border/40 shadow-sm flex items-center justify-center h-14"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Logo />
      </div>
    </div>
  );
}
