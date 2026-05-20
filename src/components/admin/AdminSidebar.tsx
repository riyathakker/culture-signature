"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  ChevronRight,
  Home,
  LayoutGrid
} from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { label: t("admin.sidebar.overview"), href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: t("admin.sidebar.products"), href: ROUTES.ADMIN.PRODUCTS, icon: Package },
    { label: t("admin.sidebar.orders"), href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
    { label: t("admin.sidebar.customers"), href: ROUTES.ADMIN.CUSTOMERS, icon: Users },
    { label: t("admin.sidebar.discounts"), href: ROUTES.ADMIN.DISCOUNTS, icon: Tag },
    { label: t("admin.sidebar.categories"), href: ROUTES.ADMIN.CATEGORIES, icon: LayoutGrid },
  ];

  return (
    <aside className="w-64 h-screen bg-primary border-r border-border/50 fixed left-0 top-0 hidden lg:flex flex-col">
      <div className="p-8">
        <Link href="/" className="text-2xl text-primary-foreground font-heading tracking-tighter">
          Culture Signature
        </Link>
        <p className="text-primary-foreground font-serif italic text-sm">Admin</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-sm transition-all group",
                isActive 
                  ? "bg-primary-foreground text-primary shadow-sm" 
                  : "hover:bg-primary-foreground/60 text-primary-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-primary-foreground")} />
                <span className="text-spaced-bold">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 px-4 py-3 text-primary-foreground hover:text-foreground transition-all group"
        >
          <Home className="w-4 h-4 opacity-60 group-hover:opacity-100" />
          <span className="text-[10px] uppercase tracking-widest font-bold">{t("admin.sidebar.home")}</span>
        </Link>
      </div>
    </aside>
  );
}
