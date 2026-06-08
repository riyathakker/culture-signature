"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Profile Overview", href: "/account", icon: User },
  { label: "Order History", href: "/account/orders", icon: ShoppingBag },
  { label: "My Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Account Settings", href: "/account/settings", icon: Settings },
];

export function AccountSidebar() {
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const pathname = usePathname();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const filteredNavItems = navItems.filter(item => {
    if (isAdmin) {
      return !["Order History", "My Wishlist", "Saved Addresses"].includes(item.label);
    }
    return true;
  });

  return (
    <aside className="w-full lg:w-64 space-y-8">
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
                <span className="text-spaced-bold">{item.label}</span>
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
            <span className="text-spaced-bold">Sign Out</span>
          </button>
        </div>
      </div>

      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={() => {
          signOut({ callbackUrl: ROUTES.HOME });
          toast.success("Successfully signed out");
        }}
        title="Sign Out"
        description="Are you sure you want to end your current session?"
        confirmText="Sign Out"
        variant="destructive"
      />

      {/* Mobile Horizontal Nav — hidden in PWA mode (bottom tabs handle navigation) */}
      <div className="lg:hidden pwa-hide relative">
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-4 px-1 scroll-smooth">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 whitespace-nowrap rounded-sm transition-all border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-spaced-bold font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Scroll Indicators */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        <div className="absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 opacity-50" />
      </div>
    </aside>
  );
}
