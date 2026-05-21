"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, LayoutGrid, Sparkles } from "lucide-react";
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
    { label: t("admin.sidebar.categories"), href: ROUTES.ADMIN.CATEGORIES, icon: LayoutGrid },
    { label: t("admin.sidebar.content"), href: ROUTES.ADMIN.CONTENT, icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-primary border-t border-primary-foreground/20">
      <div
        className="flex items-stretch overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {allItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ scrollSnapAlign: "start", minWidth: "25%" }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200",
                isActive
                  ? "text-primary-foreground"
                  : "text-primary-foreground/50 hover:text-primary-foreground/80"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-5 rounded-sm transition-all duration-200",
                  isActive && "bg-primary-foreground/15"
                )}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[8px] uppercase tracking-wider font-bold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}