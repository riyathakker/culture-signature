"use client";

import { useEffect, useRef } from "react";
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { OrderRow } from "@/components/account/OrderRow";
import { ROUTES } from "@/constants/routes";
import { useOrderStore } from "@/store/orderStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { OrdersSkeleton } from "@/components/account/AccountSkeletons";
import { useTranslation } from "@/context/TranslationContext";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { myOrders, myOrdersLoading, fetchMyOrders, applyOrderUpdate } = useOrderStore();
  const { t } = useTranslation();
  const sseRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push(ROUTES.HOME); return; }
    if (status !== "authenticated") return;

    fetchMyOrders();

    // SSE: subscribe to live order status updates
    const es = new EventSource("/api/orders/stream");
    sseRef.current = es;

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "init") {
          useOrderStore.setState({ myOrders: msg.orders, myOrdersLoading: false });
        } else if (msg.type === "update") {
          applyOrderUpdate(msg.orders);
        }
      } catch {}
    };

    es.onerror = () => { es.close(); };

    return () => { es.close(); sseRef.current = null; };
  }, [status]);

  if (myOrdersLoading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-3xl font-heading">{t("account.orders.heading")}</h2>
        <p className="muted-italic pwa-hide">{t("account.orders.subtitle")}</p>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t("account.orders.emptyTitle")}
          description={t("account.orders.emptyDescription")}
          action={{ label: t("account.common.discoverCollection"), href: ROUTES.COLLECTIONS }}
          className="py-16"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block border rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="text-spaced-bold h-14">{t("account.orders.table.id")}</TableHead>
                  <TableHead className="text-spaced-bold h-14">{t("account.orders.table.date")}</TableHead>
                  <TableHead className="text-spaced-bold h-14">{t("account.orders.table.status")}</TableHead>
                  <TableHead className="text-spaced-bold h-14 text-right">{t("account.orders.table.total")}</TableHead>
                  <TableHead className="h-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOrders.map((order) => (
                  <OrderRow key={order.id} order={order} variant="table" />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {myOrders.map((order) => (
              <OrderRow key={order.id} order={order} variant="card" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
