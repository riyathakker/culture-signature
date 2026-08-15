"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./ReviewModal";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";

function statusClass(status: string) {
  if (status === "DELIVERED") return "border-green-500 text-green-500";
  if (status === "PENDING") return "border-amber-500 text-amber-500";
  if (status === "CANCELLED") return "border-destructive text-destructive";
  return "border-primary text-primary";
}

function OrderItems({ order }: { order: any }) {
  const { t } = useTranslation();
  return (
    <div className="p-4 space-y-3 animate-in slide-in-from-top-2 duration-300 border-t border-border/50 bg-secondary/5">
      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">{t("account.orders.orderItems")}</h4>
      <div className="space-y-3">
        {order.items?.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between bg-background p-3 rounded-sm border border-border/50">
            <div className="flex items-center gap-3">
              <ImageLightbox
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-10 h-10 bg-secondary/30 rounded-sm overflow-hidden shrink-0"
                imgClassName="w-full h-full object-cover"
              />
              <div>
                <p className="text-xs font-medium">{item.product.name}</p>
                <p className="text-[10px] text-muted-foreground">{t("account.orders.qty")}: {item.quantity} × ₹{item.price.toLocaleString()}</p>
              </div>
            </div>
            {order.status === "DELIVERED" && (
              <ReviewModal productId={item.product.id} productName={item.product.name} orderId={order.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface OrderRowProps {
  order: any;
  variant?: "table" | "card";
}

export function OrderRow({ order, variant = "table" }: OrderRowProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const href = `/account/orders/${order.id}`;

  if (variant === "card") {
    return (
      <div className="bg-background border border-border/50 rounded-sm overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Top row: ID + status */}
          <div className="flex items-center justify-between">
            <Link href={href} className="text-xs font-bold font-mono hover:text-primary transition-colors">
              #{order.id.slice(-8).toUpperCase()}
            </Link>
            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-widest h-5", statusClass(order.status))}>
              {t(`account.orders.status.${order.status.toLowerCase()}`)}
            </Badge>
          </div>

          {/* Product image strip */}
          {order.items?.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {order.items.slice(0, 4).map((item: any) => (
                  <div key={item.id} className="relative w-10 h-10 rounded-full ring-2 ring-background overflow-hidden bg-secondary/40 shrink-0">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-10 h-10 rounded-full ring-2 ring-background bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold">+{order.items.length - 4}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {order.items.length} {order.items.length === 1 ? t("account.orders.itemSingular") : t("account.orders.itemPlural")}
              </span>
            </div>
          )}

          {/* Date + price */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="font-bold text-sm">₹{order.totalPrice.toLocaleString()}</span>
          </div>

          {/* Actions row */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 text-spaced-bold gap-2 border border-border/50 h-8"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isExpanded ? t("account.orders.hide") : t("account.orders.itemsLabel")}
            </Button>
            <Link
              href={href}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-[10px] uppercase tracking-widest font-bold border border-border/50 rounded-md hover:border-primary/50 hover:text-primary transition-colors px-3"
            >
              {t("account.orders.details")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        {isExpanded && <OrderItems order={order} />}
      </div>
    );
  }

  return (
    <>
      <TableRow className="hover:bg-secondary/5 transition-colors group">
        <TableCell className="font-medium text-sm py-6">
          <Link href={href} className="hover:text-primary transition-colors font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </Link>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={statusClass(order.status)}>{t(`account.orders.status.${order.status.toLowerCase()}`)}</Badge>
        </TableCell>
        <TableCell className="text-right font-medium">₹{order.totalPrice.toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-spaced-bold gap-1.5 h-8">
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {isExpanded ? t("account.orders.hide") : t("account.orders.itemsLabel")}
            </Button>
            <Link
              href={href}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {t("account.orders.view")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-secondary/10 border-b-2 border-primary/10">
          <TableCell colSpan={5} className="p-0">
            <OrderItems order={order} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
