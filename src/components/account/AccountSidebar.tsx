"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
  Home
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "@/context/TranslationContext";

const navItems = [
  { id: "overview", labelKey: "account.sidebar.overview", href: "/account", icon: User },
  { id: "orders", labelKey: "account.orders.heading", href: "/account/orders", icon: ShoppingBag },
  { id: "wishlist", labelKey: "account.sidebar.wishlist", href: "/account/wishlist", icon: Heart },
];

const homeNavItem = { id: "home", labelKey: "nav.links.home", href: ROUTES.HOME, icon: Home };

export function AccountSidebar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const pathname = usePathname();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  // Admins only get the merged Account page (profile + danger zone) — orders
  // and wishlist are shopper-only concepts.
  const filteredNavItems = isAdmin
    ? [...navItems.filter((item) => item.id === "overview"), homeNavItem]
    : navItems;

  return (
    <aside className="w-full lg:w-64 space-y-8 [@media(display-mode:standalone)]:hidden">
      <div className="hidden lg:block space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-sm transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "" : "text-primary opacity-60 group-hover:opacity-100")} />
                <span className="text-spaced-bold">{t(item.labelKey)}</span>
              </div>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}

        <div className="pt-8 mt-8 border-t">
          <button
            onClick={() => setIsSignOutDialogOpen(true)}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors w-full group"
          >
            <LogOut className="w-4 h-4 opacity-60 group-hover:opacity-100" />
            <span className="text-spaced-bold">{t("nav.account.signOut")}</span>
          </button>
        </div>
      </div>

      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={() => {
          signOut({ callbackUrl: ROUTES.HOME });
          toast.success(t("nav.account.signOutSuccess"));
        }}
        title={t("nav.account.signOut")}
        description={t("nav.account.signOutConfirm")}
        confirmText={t("nav.account.signOut")}
        variant="destructive"
      />

      {/* Mobile Tab Nav — hidden in PWA mode (bottom tabs handle navigation) */}
      <div className="lg:hidden pwa-hide">
        <div className="flex items-stretch gap-1 rounded-full border border-border bg-secondary/20 p-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex items-center justify-center text-center px-1.5 py-2.5 rounded-full transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground active:bg-secondary/60"
                )}
              >
                <span className="text-[9px] leading-tight uppercase tracking-wide font-bold">
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
