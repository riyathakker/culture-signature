"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import {
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

import { IconButton } from "@/components/ui/IconButton";

interface UserMenuProps {
  isLoggedIn: boolean;
  session: Session | null;
  onAuthModalOpen: () => void;
}

interface SessionUser {
  role?: string;
}

import { useTranslation } from "@/context/TranslationContext";

export function UserMenu({
  isLoggedIn,
  session,
  onAuthModalOpen,
}: UserMenuProps) {
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const { t } = useTranslation();

  const user = session?.user as SessionUser | undefined;

  const isAdmin = user?.role === "ADMIN";

  const menuItems = useMemo(
    () => [
      ...(isAdmin
        ? [
            {
              href: "/admin",
              label: t("nav.account.adminPanel"),
              icon: LayoutDashboard,
            },
          ]
        : []),

      {
        href: "/account",
        label: t("nav.account.myAccount"),
        icon: User,
      },
    ],
    [isAdmin, t]
  );

  const handleSignOut = async () => {
    await signOut();

    toast.success(t("nav.account.signOutSuccess"));
  };

  if (!isLoggedIn) {
    return (
      <IconButton 
        icon={User} 
        onClick={onAuthModalOpen} 
        aria-label={t("nav.account.label")}
      />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton icon={User} aria-label={t("nav.account.menuLabel")} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="mt-2 w-44"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <DropdownMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center cursor-pointer"
                >
                  <Icon className="mr-2 h-4 w-4" />

                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setIsSignOutDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />

            <span>{t("nav.account.signOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={handleSignOut}
        title={t("nav.account.signOut")}
        description={t("nav.account.signOutConfirm")}
        confirmText={t("nav.account.signOut")}
        variant="destructive"
      />
    </>
  );
}