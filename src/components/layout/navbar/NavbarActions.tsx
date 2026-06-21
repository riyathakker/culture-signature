"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Search } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { UserMenu } from "./UserMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export function NavbarActions() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { openModal } = useAuthStore();
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
    <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    <div className="flex items-center justify-end space-x-1 lg:space-x-4">

      <button
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
        className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      <div className="hidden lg:flex">
        <UserMenu
          isLoggedIn={isLoggedIn}
          session={session}
          onAuthModalOpen={() => openModal()}
        />
      </div>

      <AuthModal />

      {isLoggedIn && !isAdmin && (
        <>
          <Link href="/wishlist">
            <IconButton
              icon={Heart}
              className="hidden md:flex"
              aria-label={t("nav.wishlist")}
            />
          </Link>

          <Link href={ROUTES.SHOPPING_BAG} className="hidden md:block">
            <div className="relative group">
              <IconButton icon={ShoppingBag} aria-label={t("nav.bag")} />
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
    </>
  );
}
