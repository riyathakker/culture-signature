"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Sparkles, ShoppingBag, User,
  LayoutDashboard, Package, Heart, MapPin, Settings, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { ROUTES } from "@/constants/routes";

const mainTabs = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "New In", href: ROUTES.NEW_ARRIVALS, icon: Sparkles },
  { label: "Bag", href: "/bag", icon: ShoppingBag, showBadge: true },
  { label: "Account", href: "/account", icon: User, authRequired: true },
];

const accountTabs = [
  { label: "Back", href: ROUTES.HOME, icon: ChevronLeft, isBack: true },
  { label: "Profile", href: "/account", icon: LayoutDashboard, exact: true },
  { label: "Orders", href: ROUTES.ACCOUNT.ORDERS, icon: Package },
  { label: "Wishlist", href: ROUTES.ACCOUNT.WISHLIST, icon: Heart },
  { label: "Settings", href: ROUTES.ACCOUNT.SETTINGS, icon: Settings },
];

function NavTab({
  label, href, icon: Icon, isActive, badge, onClick,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  badge?: number;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className="relative">
        <Icon className={cn("w-5 h-5 transition-all duration-200", isActive && "scale-110")} />
        {badge != null && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className={cn(
        "text-[8px] uppercase tracking-widest font-bold transition-colors leading-none",
        isActive ? "text-primary" : "text-muted-foreground/60"
      )}>
        {label}
      </span>
      {isActive && (
        <span className="absolute bottom-0 inset-x-0 mx-auto w-8 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}

export function PWABottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { status, data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isOnAccount = pathname.startsWith("/account");

  const tabs = isOnAccount ? accountTabs : mainTabs;

  return (
    <>
      <nav
        className="pwa-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/50 hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Section label */}
        {isOnAccount && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-0.5 rounded-full border border-border/50">
            <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">My Account</span>
          </div>
        )}

        <div className="flex items-stretch h-16">
          {tabs.map((tab) => {
            const { label, href, icon, isBack, exact, showBadge, authRequired } = tab as any;

            const isActive = exact
              ? pathname === href
              : isBack
              ? false
              : pathname.startsWith(href);

            const handleClick = (e: React.MouseEvent) => {
              if (authRequired && status !== "authenticated") {
                e.preventDefault();
                setAuthOpen(true);
              }
            };

            const resolvedHref = authRequired && isAdmin
              ? ROUTES.ADMIN.DASHBOARD
              : href;

            return (
              <NavTab
                key={href}
                label={label}
                href={resolvedHref}
                icon={icon}
                isActive={isActive}
                badge={showBadge ? cartCount : undefined}
                onClick={authRequired ? handleClick : undefined}
              />
            );
          })}
        </div>
      </nav>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
