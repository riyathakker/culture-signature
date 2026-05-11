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

export function UserMenu({
  isLoggedIn,
  session,
  onAuthModalOpen,
}: UserMenuProps) {
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const user = session?.user as SessionUser | undefined;

  const isAdmin = user?.role === "ADMIN";

  const menuItems = useMemo(
    () => [
      ...(isAdmin
        ? [
            {
              href: "/admin",
              label: "Admin Panel",
              icon: LayoutDashboard,
            },
          ]
        : []),

      {
        href: "/account",
        label: "My Account",
        icon: User,
      },
    ],
    [isAdmin]
  );

  const handleSignOut = async () => {
    await signOut();

    toast.success("Successfully signed out");
  };

  if (!isLoggedIn) {
    return (
      <IconButton 
        icon={User} 
        onClick={onAuthModalOpen} 
        aria-label="Account"
      />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton icon={User} aria-label="Account menu" />
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

            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={handleSignOut}
        title="Sign Out"
        description="Are you sure you want to end your current session?"
        confirmText="Sign Out"
        variant="destructive"
      />
    </>
  );
}