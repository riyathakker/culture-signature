import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountStatCard } from "@/components/account/AccountStatCard";
import { ROUTES } from "@/constants/routes";

export default async function AccountPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      orders: true,
      wishlist: true,
    }
  });

  if (!dbUser) {
    redirect("/");
  }

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(dbUser.createdAt);

  const initials = dbUser.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const isAdmin = (session.user as any).role === "ADMIN";

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Card */}
      <div className="bg-secondary/10 p-8 rounded-sm flex flex-col md:flex-row items-center gap-8 border border-border/50">
        <Avatar className="w-24 h-24 border-2 border-primary p-1 bg-background">
          <AvatarFallback className="text-2xl font-heading bg-background">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-3xl font-heading">{dbUser.name}</h2>
          </div>
          <p className="muted-italic">Member since {memberSince}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <Link href={ROUTES.ACCOUNT.SETTINGS}>
              <Button variant="outline" size="sm" className="text-spaced-bold">Edit Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {!isAdmin && (
        <div className="grid grid-cols-2 gap-6">
          <AccountStatCard 
            label="Total Orders"
            value={dbUser.orders.length}
            icon={ShoppingBag}
            href={ROUTES.ACCOUNT.ORDERS}
          />

          <AccountStatCard 
            label="Wishlist Pieces"
            value={dbUser.wishlist.length}
            icon={Heart}
            href={ROUTES.ACCOUNT.WISHLIST}
          />
        </div>
      )}

      {/* Recent Orders Preview */}
      {!isAdmin && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-heading">Recent Selection</h3>
            <Link href="/account/orders" className="text-spaced-bold text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-primary hover:border-primary transition-all">
              See All Orders
            </Link>
          </div>
          
          {dbUser.orders.length > 0 ? (
            <div className="border rounded-sm overflow-hidden">
              <div className="bg-secondary/20 p-4 border-b flex justify-between items-center text-spaced-bold">
                <div className="flex gap-8">
                  <span>Order #{dbUser.orders[0].id.slice(-8).toUpperCase()}</span>
                  <span className="hidden md:inline">Placed {new Date(dbUser.orders[0].createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-primary">{dbUser.orders[0].status}</span>
              </div>
              <div className="p-6 flex gap-6 italic text-muted-foreground font-serif">
                You have {dbUser.orders.length} orders in your collection.
              </div>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed rounded-sm text-center space-y-4">
              <p className="muted-italic">Your collection is waiting for its first masterpiece.</p>
              <Link href={ROUTES.COLLECTIONS}>
                <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8">Discover Collection</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
