"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useTranslation } from "@/context/TranslationContext";

export function PWAPageHeader() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const user = session?.user;
  const [signOutOpen, setSignOutOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : "G";

  return (
    <>
      <header
        className="hidden fixed top-0 left-0 right-0 z-50 bg-primary px-5 pb-4 [@media(display-mode:standalone)]:flex items-center justify-between"
        style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
      >
        <Link href={ROUTES.HOME} className="text-xl text-primary-foreground font-heading tracking-tighter leading-none">
          Culture Signature
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSignOutOpen(true)}
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label={t("nav.account.signOut")}
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-full bg-primary-foreground flex items-center justify-center shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary text-xs font-bold">{initials}</span>
              )}
            </div>
          </div>
        )}
      </header>

      <ConfirmationDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={() => {
          signOut({ redirect: false }).then(() => {
            toast.success(t("nav.account.signOutSuccess"));
            window.location.href = ROUTES.HOME;
          });
        }}
        title={t("nav.account.signOut")}
        description={t("nav.account.signOutConfirm")}
        confirmText={t("nav.account.signOut")}
        variant="destructive"
      />
    </>
  );
}
