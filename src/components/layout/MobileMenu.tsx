"use client";

import { Menu, ChevronRight, ShoppingBag, Heart, User, LayoutDashboard, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconButton } from "@/components/common/IconButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { navigationLinks } from "@/constants/constants";
import { useCartStore } from "@/store/cartStore";

import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { t } = useTranslation();

  const getTranslatedName = (name: string) => {
    switch (name) {
      case "Home": return t("nav.links.home");
      case "New Arrivals": return t("nav.links.newArrivals");
      case "Collections": return t("nav.links.collections");
      case "About Us": return t("nav.links.aboutUs");
      case "Contact Us": return t("nav.links.contactUs");
      default: return name;
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <IconButton icon={Menu} variant="secondary" className="lg:hidden" aria-label="Menu" />
          }
        />
        <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col p-0" showCloseButton={false}>
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-heading text-2xl tracking-tighter uppercase">
                Culture Signature
              </SheetTitle>
              <SheetClose className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1">
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6 pb-8">
              <nav>
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between group py-4 border-b border-border/20 last:border-0"
                  >
                    <span className="text-lg font-serif group-hover:text-primary transition-colors">
                      {getTranslatedName(item.name)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </nav>

              {isLoggedIn && !isAdmin && (
                <div className="border-t pt-2">
                  <Link
                    href={ROUTES.SHOPPING_BAG}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between group py-4 border-b border-border/20"
                  >
                    <div className="flex items-center space-x-3 text-muted-foreground group-hover:text-foreground transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-sm uppercase tracking-widest">{t("cart.page.title")}</span>
                    </div>
                    {itemCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-4 border-b border-border/20"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">{t("nav.wishlist")}</span>
                  </Link>
                </div>
              )}

              <div className="border-t pt-2 bg-secondary/10 -mx-6 px-6 rounded-none">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-4 border-b border-border/20"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">{t("nav.account.adminPanel")}</span>
                  </Link>
                )}
                {isLoggedIn && !isAdmin ? (
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-4 border-b border-border/20"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">{t("nav.account.myAccount")}</span>
                  </Link>
                ) : !isLoggedIn && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/login");
                    }}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors w-full text-left py-4 border-b border-border/20"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">{t("nav.account.signIn")}</span>
                  </button>
                )}
                {isLoggedIn && (
                  <button
                    onClick={() => setIsSignOutDialogOpen(true)}
                    className="flex items-center space-x-3 text-destructive hover:text-destructive/80 transition-colors w-full text-left py-4"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-widest">{t("nav.account.signOut")}</span>
                  </button>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={() => {
          setOpen(false);
          signOut({ callbackUrl: "/" });
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
