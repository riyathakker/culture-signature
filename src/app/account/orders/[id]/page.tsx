"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOrderStore } from "@/store/orderStore";
import { Loader2, ArrowLeft, MapPin, Package, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { ReviewModal } from "@/components/account/ReviewModal";
import { OrderTracker } from "@/components/account/OrderTracker";

function statusClass(status: string) {
  if (status === "DELIVERED") return "border-green-500 text-green-500 bg-green-500/5";
  if (status === "PENDING") return "border-amber-500 text-amber-500 bg-amber-500/5";
  if (status === "CANCELLED") return "border-destructive text-destructive bg-destructive/5";
  return "border-primary text-primary bg-primary/5";
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { myOrders, myOrdersLoading, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    if (status === "unauthenticated") { router.push(ROUTES.HOME); return; }
    if (status === "authenticated" && myOrders.length === 0) fetchMyOrders();
  }, [status]);

  const order = myOrders.find((o) => o.id === id);

  if (myOrdersLoading || status === "loading") {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="font-heading text-2xl">Order not found</p>
        <Link href={ROUTES.ACCOUNT.ORDERS} className="text-primary text-sm uppercase tracking-widest underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const subtotal = order.items?.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) || 0;
  const discount = (order as any).discountAmount || 0;
  const taxable = subtotal - discount;
  const gst = taxable * 0.18;
  const shipping = taxable >= 5000 ? 0 : 200;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back + Header */}
      <div className="space-y-4">
        <Link
          href={ROUTES.ACCOUNT.ORDERS}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> All Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-heading">Order Details</h2>
            <p className="muted-italic">Your order details.</p>
          </div>
          <Badge variant="outline" className={cn("text-sm font-bold uppercase tracking-widest px-4 py-2 w-fit", statusClass(order.status))}>
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Order tracker */}
      <div className="border border-border/40 rounded-sm px-4 bg-secondary/10">
        <OrderTracker status={order.status} createdAt={String(order.createdAt)} />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-secondary/20 rounded-sm p-4 space-y-1 border border-border/30">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Hash className="w-3 h-3" /> Order ID
          </div>
          <p className="font-mono text-sm font-bold">#{(order.id as string).slice(-8).toUpperCase()}</p>
        </div>
        <div className="bg-secondary/20 rounded-sm p-4 space-y-1 border border-border/30">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Calendar className="w-3 h-3" /> Placed On
          </div>
          <p className="text-sm font-medium">
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="bg-secondary/20 rounded-sm p-4 space-y-1 border border-border/30">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            <Package className="w-3 h-3" /> Items
          </div>
          <p className="text-sm font-medium">{order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading">Your Items</h3>
        <div className="space-y-3">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-background border border-border/40 rounded-sm">
              <div className="w-16 h-20 rounded-sm overflow-hidden bg-secondary/30 shrink-0">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-heading text-base leading-tight">{item.product?.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                  Qty {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                {order.status === "DELIVERED" && (
                  <ReviewModal
                    productId={item.product?.id}
                    productName={item.product?.name}
                    orderId={order.id as string}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Price Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading">Price Breakdown</h3>
          <div className="bg-secondary/20 rounded-sm p-6 border border-border/30 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-bold">Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span className="uppercase tracking-widest text-[11px] font-bold">
                  Discount {(order as any).promoCode ? `(${(order as any).promoCode})` : ""}
                </span>
                <span className="font-bold">-₹{discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-bold">GST (18%)</span>
              <span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-bold">Shipping</span>
              {shipping === 0 ? (
                <span className="text-primary font-bold text-[11px] uppercase tracking-widest">Free</span>
              ) : (
                <span>₹{shipping}</span>
              )}
            </div>
            <Separator className="bg-border/40" />
            <div className="flex justify-between font-heading text-lg text-primary">
              <span>Total</span>
              <span>₹{order.totalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {(order as any).street && (
          <div className="space-y-4">
            <h3 className="text-lg font-heading">Shipping Address</h3>
            <div className="bg-secondary/20 rounded-sm p-6 border border-border/30 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                <div className="space-y-0.5 text-sm">
                  <p className="font-medium">{(order as any).customerName}</p>
                  <p className="text-muted-foreground">{(order as any).street}</p>
                  <p className="text-muted-foreground">
                    {[(order as any).city, (order as any).state, (order as any).zipCode].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-muted-foreground">{(order as any).country}</p>
                  {(order as any).phone && (
                    <p className="text-muted-foreground pt-1">{(order as any).phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
