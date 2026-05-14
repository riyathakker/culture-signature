"use client";

import { Menu, ChevronRight, ShoppingBag, Heart, User, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconButton } from "@/components/ui/IconButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { navigationLinks } from "@/constants/constants";
import { useCartStore } from "@/store/cartStore";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <IconButton icon={Menu} className="lg:hidden" aria-label="Menu" />
          }
        />
        <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col p-0">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-heading text-2xl tracking-tighter uppercase">
                Culture Signature
              </SheetTitle>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <nav className="space-y-4">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-lg font-serif group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </nav>

              <div className="pt-6 border-t space-y-4">

                <Link
                  href="/bag"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 text-muted-foreground group-hover:text-foreground transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest">Shopping Bag</span>
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
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">Wishlist</span>
                </Link>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border/50 bg-secondary/20">
            <div className="flex flex-col space-y-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">Admin Panel</span>
                </Link>
              )}
              {isLoggedIn ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">My Account</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">Sign In</span>
                </button>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => setIsSignOutDialogOpen(true)}
                  className="flex items-center space-x-3 text-destructive hover:text-destructive/80 transition-colors w-full text-left pt-4 border-t border-border/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      
      <ConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
        onConfirm={() => {
          setOpen(false);
          signOut();
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
