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
  const isAccount = pathname.startsWith("/account");
  const showPWAHeader = !isAuthPage && !isHome && !isAdmin && !isAccount;
  // Account pages keep their dedicated mobile header; storefront pages now show
  // the standard responsive web header on mobile browsers (PWA header is
  // standalone-only), so only account hides the web header on mobile.
  const hideHeaderOnMobile = isAccount;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAdmin && (
        <div className={hideHeaderOnMobile ? "hidden lg:block pwa-hide" : "pwa-hide"}>
          <Header />
        </div>
      )}
      {showPWAHeader && <PWAPageHeader />}
      {children}
      {!isAdmin && (
        <>
          <div className="pwa-hide">
            <Footer />
          </div>
          <div className="pwa-hide">
            <MobileFloatingCart />
          </div>
        </>
      )}
      <PWABottomNav />
      <PWAInstallPrompt />
    </>
  );
}
