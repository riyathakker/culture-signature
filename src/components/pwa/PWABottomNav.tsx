"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Sparkles, ShoppingBag, User,
  Package, Heart, MapPin, Settings, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/constants/routes";

const mainTabs = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "New In", href: ROUTES.NEW_ARRIVALS, icon: Sparkles },
  { label: "Collections", href: ROUTES.COLLECTIONS, icon: Sparkles },
  { label: "Bag", href: ROUTES.SHOPPING_BAG, icon: ShoppingBag, showBadge: true },
  { label: "Account", href: ROUTES.ACCOUNT.DASHBOARD, icon: User, authRequired: true },

];

const accountTabs = [
  { label: "Back", href: ROUTES.HOME, icon: ChevronLeft, isBack: true },
  { label: "Orders", href: ROUTES.ACCOUNT.ORDERS, icon: Package },
  { label: "Wishlist", href: ROUTES.ACCOUNT.WISHLIST, icon: Heart },
  { label: "Addresses", href: ROUTES.ACCOUNT.ADDRESSES, icon: MapPin },
  { label: "Settings", href: ROUTES.ACCOUNT.SETTINGS, icon: Settings },
];

interface NavTabProps {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  badge?: number;
  onClick?: (e: React.MouseEvent) => void;
}

function NavTab({
  label,
  href,
  icon: Icon,
  isActive,
  badge,
  onClick,
}: NavTabProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-w-0 py-2",
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
        "text-[9px] uppercase tracking-wider font-bold transition-colors leading-none w-full text-center mt-1",
        isActive ? "text-primary" : "text-muted-foreground/60"
      )}>
        {label}
      </span>
      {isActive && (
        <span className="absolute top-0 inset-x-0 mx-auto w-8 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
}

export function PWABottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCartStore();
  const { data: session } = useSession();

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isLoggedIn = !!session?.user;
  const isOnAccount = pathname.startsWith("/account");

  const tabs = isOnAccount ? accountTabs : mainTabs;

  return (
    <nav
      className="pwa-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 hidden shadow-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {isOnAccount && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary/10 backdrop-blur-sm px-4 py-1 rounded-full border border-primary/20">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-primary">My Account</span>
        </div>
      )}

      <div className="flex items-stretch h-16 w-full px-2">
        {tabs.map((tab) => {
          const { label, href, icon, isBack, showBadge, authRequired } = tab as any;

          const isActive = isBack
            ? false
            : pathname === href || pathname.startsWith(href + "/");

          const resolvedHref = authRequired && isAdmin
            ? ROUTES.ADMIN.DASHBOARD
            : href;

          const handleClick = authRequired && !isLoggedIn && !isAdmin
            ? (e: React.MouseEvent) => { e.preventDefault(); router.push("/login"); }
            : undefined;

          return (
            <NavTab
              key={label}
              label={label}
              href={resolvedHref}
              icon={icon}
              isActive={isActive}
              badge={showBadge ? cartCount : undefined}
              onClick={handleClick}
            />
          );
        })}
      </div>
    </nav>
  );
}
