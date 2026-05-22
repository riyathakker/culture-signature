"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

const PAGE_LABELS: Record<string, string> = {
  "/account": "My Account",
  "/account/orders": "Order History",
  "/account/wishlist": "My Wishlist",
  "/account/addresses": "Saved Addresses",
  "/account/settings": "Settings",
};

export function AccountMobileHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "U";

  const pageLabel = PAGE_LABELS[pathname] ?? "My Account";

  return (
    <>
      <header
        className="pwa-account-header hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border/40 shadow-sm flex-col"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between px-5 h-14">
          {/* Page title */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground leading-none">
              Culture Signature
            </p>
            <p className="font-heading text-base leading-tight mt-0.5">{pageLabel}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSignOutOpen(true)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary text-[10px] font-bold">{initials}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmationDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={() => {
          signOut({ callbackUrl: ROUTES.HOME });
          toast.success("Successfully signed out");
        }}
        title="Sign Out"
        description="Are you sure you want to end your current session?"
        confirmText="Sign Out"
        variant="destructive"
      />
    </>
  );
}
