"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileFloatingCart } from "@/components/cart/MobileFloatingCart";
import { PWABottomNav } from "@/components/pwa/PWABottomNav";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { PWAPageHeader } from "@/components/pwa/PWAPageHeader";

const AUTH_PATHS = ["/login", "/signup"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const showPWAHeader = !isAuthPage && !isHome && !isAdmin;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pwa-hide">
        <Header />
      </div>
      {showPWAHeader && <PWAPageHeader />}
      {children}
      <div className="pwa-hide">
        <Footer />
      </div>
      <div className="pwa-hide">
        <MobileFloatingCart />
      </div>
      <PWABottomNav />
      <PWAInstallPrompt />
    </>
  );
}
