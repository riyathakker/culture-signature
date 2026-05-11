"use client";

import { StatCard } from "@/components/admin/StatCard";
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Activity,
  ArrowUpRight,
  Package,
  Loader2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {cn} from "@/lib/utils"
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/button";
import { CommonLoader } from "@/components/common/Loader";

export default function AdminOverview() {
  const { overview: data, isLoading, fetchOverview } = useAdminStore();

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading && !data) {
    return (
      <CommonLoader />
    );
  }

  if (!data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground font-serif italic">Failed to load the executive summary.</p>
        <Button onClick={() => fetchOverview()} variant="outline" className="uppercase tracking-widest text-[10px] font-bold">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading tracking-tight">Executive Overview</h1>
        <p className="text-muted-foreground font-serif italic">Real-time pulse of the Culture Signature house.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value={formatPrice(data.revenue)} trend="+12.5%" trendType="up" icon={IndianRupee} />
        <StatCard label="Active Orders" value={data.activeOrders.toString()} trend="+4.2%" trendType="up" icon={ShoppingBag} />
        <StatCard label="Total Customers" value={data.customers.toString()} trend="+8.1%" trendType="up" icon={Users} />
        <StatCard label="Conv. Rate" value="3.8%" trend="-0.4%" trendType="down" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Priority Orders</h3>
            <Link href="/admin/orders" className="text-[10px] uppercase tracking-widest font-bold text-primary hover:opacity-70">View All</Link>
          </div>
          <div className="bg-background border border-border/50 rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold h-12">ID</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold h-12">Customer</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold h-12">Total</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold h-12">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-xs text-muted-foreground italic">No recent orders</TableCell>
                  </TableRow>
                ) : (
                  data.recentOrders.map((order: any) => (
                    <TableRow key={order.id} className="hover:bg-secondary/5 transition-colors">
                      <TableCell className="font-bold text-xs">#{order.id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell className="text-xs font-serif italic">{order.user?.name || "Anonymous"}</TableCell>
                      <TableCell className="text-xs font-bold">{formatPrice(order.totalPrice)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] tracking-widest font-bold h-5 uppercase">
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="space-y-4">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Inventory Alerts</h3>
          <div className="space-y-4">
            {data.lowStockProducts.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border/50 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Inventory Secured</p>
              </div>
            ) : (
              data.lowStockProducts.map((product: any) => {
                const isOutOfStock = product.stock === 0;
                return (
                  <Link 
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="bg-background border border-border/50 p-4 rounded-sm flex items-center gap-4 hover:bg-secondary/5 transition-colors group"
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-sm",
                      isOutOfStock ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
                    )}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground font-serif italic">
                        {isOutOfStock ? "Out of stock" : `Low stock: ${product.stock} units left`}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
