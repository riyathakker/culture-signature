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
  LayoutGrid,
  Sparkles,
  LogOut,
  Star,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;
  const [signOutOpen, setSignOutOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email ? user.email[0].toUpperCase() : "A";

  const menuItems = [
    { label: t("admin.sidebar.overview"), href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: t("admin.sidebar.products"), href: ROUTES.ADMIN.PRODUCTS, icon: Package },
    { label: t("admin.sidebar.orders"), href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
    { label: t("admin.sidebar.customers"), href: ROUTES.ADMIN.CUSTOMERS, icon: Users },
    { label: t("admin.sidebar.discounts"), href: ROUTES.ADMIN.DISCOUNTS, icon: Tag },
    { label: t("admin.sidebar.categories"), href: ROUTES.ADMIN.CATEGORIES, icon: LayoutGrid },
    { label: t("admin.sidebar.content"), href: ROUTES.ADMIN.CONTENT, icon: Sparkles },
    { label: "Reviews", href: ROUTES.ADMIN.REVIEWS, icon: Star },
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

      <div className="p-4 border-t border-primary-foreground/10 space-y-1">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 px-4 py-3 text-primary-foreground hover:bg-primary-foreground/10 rounded-sm transition-all group"
        >
          <Home className="w-4 h-4 opacity-60 group-hover:opacity-100" />
          <span className="text-spaced-bold font-bold">{t("admin.sidebar.home")}</span>
        </Link>

        <button
          onClick={() => setSignOutOpen(true)}
          className="flex items-center gap-3 px-4 py-3 text-primary-foreground/60 hover:text-destructive hover:bg-primary-foreground/10 rounded-sm transition-all w-full group"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-spaced-bold font-bold">{t("nav.account.signOut")}</span>
        </button>
      </div>

      <ConfirmationDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={() => { signOut({ callbackUrl: "/" }); toast.success(t("nav.account.signOutSuccess")); }}
        title={t("nav.account.signOut")}
        description={t("nav.account.signOutConfirm")}
        confirmText={t("nav.account.signOut")}
        variant="destructive"
      />
    </aside>
  );
}
