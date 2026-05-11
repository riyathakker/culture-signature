"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Package, ShoppingBag, Tag, Users } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export function AdminMobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const allItems = [
    { label: t("admin.sidebar.overview"), href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: t("admin.sidebar.products"), href: ROUTES.ADMIN.PRODUCTS, icon: Package },
    { label: t("admin.sidebar.orders"), href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
    { label: t("admin.sidebar.customers"), href: ROUTES.ADMIN.CUSTOMERS, icon: Users },
    { label: t("admin.sidebar.discounts"), href: ROUTES.ADMIN.DISCOUNTS, icon: Tag },
    { label: t("admin.sidebar.home"), href: ROUTES.HOME, icon: Home }
  ];

  return (
    <div className="lg:hidden bg-background border-b border-border/50 sticky top-20 z-20">
      <div className="relative">
        <div className="flex overflow-x-auto no-scrollbar gap-2 py-4 px-4 scroll-smooth">
          {allItems.map((item) => {
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 whitespace-nowrap rounded-sm transition-all border",
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-secondary/10 border-border/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-3.5 h-3.5", isActive ? "" : "text-primary opacity-60")} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Scroll Indicators */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 opacity-50" />
      </div>
    </div>
  );
}
