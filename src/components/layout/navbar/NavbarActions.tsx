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
import { SearchDialog } from "./SearchDialog";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export function NavbarActions() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { openModal } = useAuthStore();
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();


  return (
    <>
    <div className="flex items-center justify-end space-x-1 lg:space-x-4">

      <IconButton
        icon={Search}
        aria-label={t("search.label")}
        onClick={() => setSearchOpen(true)}
      />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

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
              {itemCount > 0 && (
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
