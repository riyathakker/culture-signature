"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useTranslation } from "@/context/TranslationContext";

export function AccountMobileHeader() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const user = session?.user;
  const [signOutOpen, setSignOutOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email
      ? user.email[0].toUpperCase()
      : "A";

  return (
    <>
      <header className=" sticky top-0 z-30 bg-primary px-5 py-4 flex items-center justify-between hidden [@media(display-mode:standalone)]:flex">
        <Link href={ROUTES.HOME} className="text-xl text-primary-foreground font-heading tracking-tighter leading-none">
          Culture Signature
          <span className="block text-primary-foreground/60 font-serif italic text-xs font-normal">
            {(user as any)?.role === "ADMIN" ? "Admin" : "My Account"}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSignOutOpen(true)}
            className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            aria-label={t("nav.account.signOut")}
          >
            <LogOut className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-full bg-primary-foreground flex items-center justify-center shrink-0">
            {user?.image ? (
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
      </header>

      <ConfirmationDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        onConfirm={() => {
          signOut({ callbackUrl: ROUTES.HOME });
          toast.success(t("nav.account.signOutSuccess"));
        }}
        title={t("nav.account.signOut")}
        description={t("nav.account.signOutConfirm")}
        confirmText={t("nav.account.signOut")}
        variant="destructive"
      />
    </>
  );
}
