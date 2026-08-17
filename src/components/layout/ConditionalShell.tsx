"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileFloatingCart } from "@/components/cart/MobileFloatingCart";
import { PWABottomNav } from "@/components/pwa/PWABottomNav";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { PWAPageHeader } from "@/components/pwa/PWAPageHeader";

const AUTH_PATHS = ["/login", "/signup"];

// While the site is in "Coming Soon" mode, hide the storefront chrome
// (header/footer/nav) and render only the page. Set to false to restore.
const COMING_SOON = true;

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (COMING_SOON) {
    return <>{children}</>;
  }
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");
  const showPWAHeader = !isAuthPage && !isHome && !isAdmin && !isAccount;
  const hideHeaderOnMobile = showPWAHeader || isAccount;

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
      {/* <PWAInstallPrompt /> */}
    </>
  );
}
