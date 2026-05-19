"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPanel = pathname.startsWith("/admin");
  const { fetchWishlist } = useWishlistStore();
  const { fetchCart, setIsAuthenticated } = useCartStore();
  const { status } = useSession();

  useEffect(() => {
    setIsAuthenticated(status === "authenticated");
    if (status === "authenticated") {
      fetchWishlist();
      fetchCart();
    }
  }, [status, fetchWishlist, fetchCart, setIsAuthenticated]);

  return (
    <main className={cn(
      "flex-grow transition-all duration-500",
      (!isAdminPanel) && "pt-[160px]",
    )}>
      {children}
    </main>
  );
}
