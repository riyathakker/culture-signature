"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isHome = pathname === "/";
  const isAccount = pathname.startsWith("/account");
  const { fetchWishlist, clearWishlist } = useWishlistStore();
  const { fetchCart, setIsAuthenticated, clearCart } = useCartStore();
  const { status } = useSession();
  const prevStatus = useRef(status);

  useEffect(() => {
    setIsAuthenticated(status === "authenticated");
    if (status === "authenticated") {
      fetchWishlist();
      fetchCart();
    }
    // Clear stores immediately when session ends
    if (prevStatus.current === "authenticated" && status === "unauthenticated") {
      clearWishlist();
    }
    prevStatus.current = status;
  }, [status, fetchWishlist, fetchCart, setIsAuthenticated, clearWishlist, clearCart]);

  const showPWAHeader = !isAdminPanel && !isAuthPage && !isHome && !isAccount;

  return (
    <main className={cn(
      "flex-grow transition-all duration-500 pwa-main-content",
      !isAdminPanel && !isAuthPage && !isAccount && " pt-[100px] md:pt-[115px]",
      isAccount && "lg:pt-[110px]",
      showPWAHeader && "pwa-page-content",
    )}>
      {children}
    </main>
  );
}
