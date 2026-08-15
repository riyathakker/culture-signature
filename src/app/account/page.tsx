"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { AccountStatCard } from "@/components/account/AccountStatCard";
import { ROUTES } from "@/constants/routes";
import { useAccountStore } from "@/store/accountStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, isLoading, fetchAccount } = useAccountStore();
  const { t } = useTranslation();
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

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {!isAdmin && (
        <div className="grid grid-cols-2 gap-6">
          <AccountStatCard label={t("account.overview.totalOrders")} value={user.orderCount} icon={ShoppingBag} href={ROUTES.ACCOUNT.ORDERS} linkText={t("account.common.viewAll")} />
          <AccountStatCard label={t("account.overview.wishlistItems")} value={user.wishlistCount} icon={Heart} href={ROUTES.ACCOUNT.WISHLIST} linkText={t("account.common.viewAll")} />
        </div>
      )}

      {!isAdmin && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-heading">{t("account.overview.recentSelection")}</h3>
            <Link href={ROUTES.ACCOUNT.ORDERS} className="text-spaced-bold text-muted-foreground border-b border-muted-foreground pb-0.5 hover:text-primary hover:border-primary transition-all">
              {t("account.overview.seeAllOrders")}
            </Link>
          </div>

          {user.latestOrder ? (
            <div className="border rounded-sm overflow-hidden">
              <div className="bg-secondary/20 p-4 border-b flex justify-between items-center text-spaced-bold">
                <div className="flex gap-8">
                  <span>{t("account.overview.order")} #{user.latestOrder.id.slice(-8).toUpperCase()}</span>
                  <span className="hidden md:inline">{t("account.overview.placed")} {new Date(user.latestOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="text-primary">{t(`account.orders.status.${user.latestOrder.status.toLowerCase()}`)}</span>
              </div>
              <div className="p-6 flex gap-6 italic text-muted-foreground font-serif">
                {t(user.orderCount === 1 ? "account.overview.ordersInCollectionOne" : "account.overview.ordersInCollectionMany", { count: user.orderCount })}
              </div>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed rounded-sm text-center space-y-4">
              <p className="muted-italic">{t("account.overview.startShopping")}</p>
              <Link href={ROUTES.COLLECTIONS}>
                <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-10 px-8">{t("account.common.discoverCollection")}</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
