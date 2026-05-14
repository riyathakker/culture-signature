"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { UserMenu } from "./UserMenu";

export function NavbarActions() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center justify-end space-x-1 lg:space-x-4">
      <div className="hidden lg:flex">
        <UserMenu
          isLoggedIn={isLoggedIn}
          session={session}
          onAuthModalOpen={() => setIsAuthModalOpen(true)}
        />
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {!isAdmin && (
        <>
          <Link href="/wishlist">
            <IconButton
              icon={Heart}
              className="hidden md:flex"
              aria-label="Wishlist"
            />
          </Link>

          <Link href="/bag" className="hidden md:block">
            <div className="relative group">
              <IconButton icon={ShoppingBag} aria-label="Shopping bag" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
