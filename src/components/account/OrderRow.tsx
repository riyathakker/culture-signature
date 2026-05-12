"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "./ReviewModal";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function OrderRow({ order }: { order: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow className="hover:bg-secondary/5 transition-colors group">
        <TableCell className="font-medium text-sm py-6">
          #{order.id.slice(-8).toUpperCase()}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </TableCell>
        <TableCell>
          <Badge 
            variant="outline" 
            className={
              order.status === "DELIVERED" 
                ? "border-green-500 text-green-500" 
                : order.status === "PENDING"
                ? "border-amber-500 text-amber-500"
                : "border-primary text-primary"
            }
          >
            {order.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-medium">₹{order.totalPrice.toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] uppercase tracking-widest gap-2"
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isExpanded ? "Hide" : "Details"}
          </Button>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className="bg-secondary/10 border-b-2 border-primary/10">
          <TableCell colSpan={5} className="p-0">
            <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold opacity-60">Order Items</h4>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-background p-4 rounded-sm border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/30 rounded-sm overflow-hidden relative">
                        <img 
                          src={item.product.images?.[0] || "/Logo.png"} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {order.status === "DELIVERED" && (
                      <ReviewModal 
                        productId={item.product.id} 
                        productName={item.product.name} 
                        orderId={order.id} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
