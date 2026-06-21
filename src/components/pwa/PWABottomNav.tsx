"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Sparkles, LayoutGrid, ShoppingBag, User,
  Package, Heart, MapPin, Settings, ChevronLeft,
  LayoutDashboard,
  Users,
  Tag,
  Star,
  Edit,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/constants/routes";

const mainTabs = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "New In", href: ROUTES.NEW_ARRIVALS, icon: Sparkles },
  { label: "Collections", href: ROUTES.COLLECTIONS, icon: LayoutGrid },
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

const adminTabs = [
  { label: "Back", href: ROUTES.HOME, icon: ChevronLeft, isBack: true },
  { label: "Overview", href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: "Products", href: ROUTES.ADMIN.PRODUCTS, icon: Package },
  { label: "Orders", href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
  { label: "Categories", href: ROUTES.ADMIN.CATEGORIES, icon: FolderOpen },
  { label: "Discounts", href: ROUTES.ADMIN.DISCOUNTS, icon: Tag },
  { label: "Customers", href: ROUTES.ADMIN.CUSTOMERS, icon: Users },
  { label: "Reviews", href: ROUTES.ADMIN.REVIEWS, icon: Star },
  { label: "Content", href: ROUTES.ADMIN.CONTENT, icon: Edit },
]

interface NavTabProps {
  label: string;
  href: string;
  icon?: React.ElementType;
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
        "relative flex-1 min-w-[72px] flex flex-col items-center justify-center gap-1 transition-colors py-2",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <div className="relative">
        {Icon && <Icon className={cn("w-5 h-5 transition-all duration-200", isActive && "scale-110")} />}
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
  const { data: session, status } = useSession();

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isLoggedIn = status === "authenticated";
  const isOnAccount = pathname.startsWith("/account");
  const isOnAdmin = pathname.startsWith("/admin");

  // Bag tab only for signed-in shoppers — hidden for guests and admins.
  const visibleMainTabs = mainTabs.filter((t) =>
    t.label === "Bag" ? isLoggedIn && !isAdmin : true
  );

  const tabs = (isAdmin && isOnAdmin) ? adminTabs : (isLoggedIn && isOnAccount) ? accountTabs : visibleMainTabs;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/40 shadow-lg",
        "pwa-bottom-nav",
        isOnAdmin && isAdmin ? "flex lg:hidden" : "hidden",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16 w-full px-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const { label, href, icon, isBack, showBadge, authRequired } = tab as any;

          const isDashboardRoute =
            href === ROUTES.ADMIN.DASHBOARD || href === ROUTES.ACCOUNT.DASHBOARD;

          const isActive = isBack
            ? false
            : isDashboardRoute
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");

          // Account tab on main nav: admins → admin dashboard,
          // logged-in shoppers → their orders (Overview is no longer a tab).
          const resolvedHref = authRequired
            ? (isAdmin ? ROUTES.ADMIN.DASHBOARD : ROUTES.ACCOUNT.ORDERS)
            : href;

          // Only divert to /login once we KNOW the user is signed out.
          // While the session is still "loading" (e.g. PWA cold-start) let the
          // Link navigate normally so a logged-in user isn't wrongly sent to login.
          const handleClick = authRequired && status === "unauthenticated" && !isAdmin
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
