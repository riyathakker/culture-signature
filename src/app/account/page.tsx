"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { AccountStatCard } from "@/components/account/AccountStatCard";
import { ROUTES } from "@/constants/routes";
import { useAccountStore } from "@/store/accountStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, isLoading, fetchAccount } = useAccountStore();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    if (status === "unauthenticated") router.push(ROUTES.HOME);
    if (status === "authenticated") fetchAccount();
  }, [status]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Card */}
      <div className="bg-secondary/10 p-8 rounded-sm flex flex-col md:flex-row items-center gap-8 border border-border/50">
        <Avatar className="w-24 h-24 border-2 border-primary p-1 bg-background">
          <AvatarFallback className="text-2xl font-heading bg-background">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-heading">{user.name}</h2>
          <p className="muted-italic">Member since {memberSince}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <Link href={ROUTES.ACCOUNT.SETTINGS}>
              <Button variant="outline" size="sm" className="text-spaced-bold">Edit Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-2 gap-6">
          <AccountStatCard label="Total Orders" value={user.orderCount} icon={ShoppingBag} href={ROUTES.ACCOUNT.ORDERS} />
          <AccountStatCard label="Wishlist Items" value={user.wishlistCount} icon={Heart} href={ROUTES.ACCOUNT.WISHLIST} />
        </div>
      )}

      {!isAdmin && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-heading">Recent Selection</h3>
            <Link href={ROUTES.ACCOUNT.ORDERS} className="text-spaced-bold text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-primary hover:border-primary transition-all">
              See All Orders
            </Link>
          </div>

          {user.latestOrder ? (
            <div className="border rounded-sm overflow-hidden">
              <div className="bg-secondary/20 p-4 border-b flex justify-between items-center text-spaced-bold">
                <div className="flex gap-8">
                  <span>Order #{user.latestOrder.id.slice(-8).toUpperCase()}</span>
                  <span className="hidden md:inline">Placed {new Date(user.latestOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-primary">{user.latestOrder.status}</span>
              </div>
              <div className="p-6 flex gap-6 italic text-muted-foreground font-serif">
                You have {user.orderCount} {user.orderCount === 1 ? "order" : "orders"} in your collection.
              </div>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed rounded-sm text-center space-y-4">
              <p className="muted-italic">Start shopping to place your first order.</p>
              <Link href={ROUTES.COLLECTIONS}>
                <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-10 px-8">Discover Collection</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
