"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./ReviewModal";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

function statusClass(status: string) {
  if (status === "DELIVERED") return "border-green-500 text-green-500";
  if (status === "PENDING") return "border-amber-500 text-amber-500";
  if (status === "CANCELLED") return "border-destructive text-destructive";
  return "border-primary text-primary";
}

function OrderItems({ order, expanded }: { order: any; expanded: boolean }) {
  if (!expanded) return null;
  return (
    <div className="p-4 space-y-3 animate-in slide-in-from-top-2 duration-300 border-t border-border/50 bg-secondary/5">
      <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Order Items</h4>
      <div className="space-y-3">
        {order.items?.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between bg-background p-3 rounded-sm border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/30 rounded-sm overflow-hidden shrink-0">
                <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-medium">{item.product.name}</p>
                <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
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
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === "card") {
    return (
      <div className="bg-background border border-border/50 rounded-sm overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">#{order.id.slice(-8).toUpperCase()}</span>
            <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-widest h-5", statusClass(order.status))}>
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="font-bold text-xs">₹{order.totalPrice.toLocaleString()}</span>
          </div>
          {order.items?.length > 0 && (
            <p className="text-[10px] text-muted-foreground italic">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-spaced-bold gap-2 border border-border/50 h-8"
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isExpanded ? "Hide Details" : "View Details"}
          </Button>
        </div>
        <OrderItems order={order} expanded={isExpanded} />
      </div>
    );
  }

  return (
    <>
      <TableRow className="hover:bg-secondary/5 transition-colors group">
        <TableCell className="font-medium text-sm py-6">
          #{order.id.slice(-8).toUpperCase()}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={statusClass(order.status)}>{order.status}</Badge>
        </TableCell>
        <TableCell className="text-right font-medium">₹{order.totalPrice.toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-spaced-bold gap-2">
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isExpanded ? "Hide" : "Details"}
          </Button>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-secondary/10 border-b-2 border-primary/10">
          <TableCell colSpan={5} className="p-0">
            <OrderItems order={order} expanded />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
