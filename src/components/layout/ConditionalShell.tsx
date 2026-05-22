"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileFloatingCart } from "@/components/cart/MobileFloatingCart";
import { PWABottomNav } from "@/components/pwa/PWABottomNav";

const AUTH_PATHS = ["/login", "/signup"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pwa-hide">
        <Header />
      </div>
      {children}
      <div className="pwa-hide">
        <Footer />
      </div>
      <div className="pwa-hide">
        <MobileFloatingCart />
      </div>
      <PWABottomNav />
    </>
  );
}
