"use client";

import {
  Download,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useOrderStore } from "@/store/orderStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

export default function AdminOrders() {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !activeStatus || order.status === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, activeStatus]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const columns: Column<any>[] = [
    {
      header: "Order ID",
      className: "font-bold text-xs",
      render: (order) => (
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={() => toggleOrderExpansion(order.id)}
          >
            {expandedOrders.has(order.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          <span>#{order.id.slice(-8).toUpperCase()}</span>
        </div>
      ),
    },
    {
      header: "Items",
      className: "min-w-[120px]",
      render: (order) => (
        <div className="flex -space-x-2 overflow-hidden">
          {order.items.slice(0, 3).map((item: any, idx: number) => (
            <div
              key={item.id}
              className="relative inline-block h-8 w-8 rounded-full ring-2 ring-background overflow-hidden bg-muted"
              title={item.product.name}
            >
              <img
                src={item.product.images?.[0] || "/Logo.png"}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-bold ring-2 ring-background">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Customer",
      render: (order) => (
        <div className="flex flex-col text-left">
          <span className="font-medium text-sm">{order.user?.name ?? order.customerName}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{order.user?.email ?? ""}</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (order) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2",
            order.status === "PENDING" ? "border-amber-500 text-amber-500 bg-amber-500/5" :
              order.status === "PAID" ? "border-blue-500 text-blue-500 bg-blue-500/5" :
                order.status === "SHIPPED" ? "border-purple-500 text-purple-500 bg-purple-500/5" :
                  order.status === "DELIVERED" ? "border-green-500 text-green-500 bg-green-500/5" :
                    "border-red-500 text-red-500 bg-red-500/5"
          )}
        >
          {order.status}
        </Badge>
      ),
    },
    {
      header: "Date",
      className: "text-muted-foreground text-xs",
      render: (order) => format(new Date(order.createdAt), "MMM dd, yyyy"),
    },
    {
      header: "Amount",
      headerClassName: "text-right",
      className: "text-right font-bold",
      render: (order) => formatPrice(order.totalPrice),
    },
    {
      header: "",
      className: "text-right",
      render: (order) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border border-border/50 shadow-xl">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <Eye className="w-4 h-4" /> {expandedOrders.has(order.id) ? "Hide Details" : "View Details"}
            </DropdownMenuItem>
            {order.status !== "SHIPPED" && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => updateOrderStatus(order.id, "SHIPPED")}
              >
                <Truck className="w-4 h-4" /> Mark as Shipped
              </DropdownMenuItem>
            )}
            {order.status === "SHIPPED" && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => updateOrderStatus(order.id, "DELIVERED")}
              >
                <CheckCircle2 className="w-4 h-4" /> Mark as Delivered
              </DropdownMenuItem>
            )}
            {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                onClick={() => updateOrderStatus(order.id, "CANCELLED")}
              >
                <XCircle className="w-4 h-4" /> Cancel Order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <AdminPageHeader
        title="Orders"
        description="Track and fulfill artisanal orders."
        action={
          <Button variant="outline" className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8 border-border/50">
            <Download className="w-4 h-4 mr-2" /> Export Orders
          </Button>
        }
      />

      <AdminFilterBar
        searchPlaceholder="Search order ID or customer..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown
          label="Status"
          icon={Filter}
          options={["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => ({ label: s, value: s }))}
          selectedValue={activeStatus}
          onSelect={setActiveStatus}
          allLabel="All Status"
        />
        <Button variant="outline" className="h-12 px-6 uppercase tracking-widest text-[10px] font-bold border-border/50 gap-2">
          Date Range
        </Button>
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        emptyMessage="No orders found matching your criteria."
        rowKey={(o) => o.id}
        expandable={{
          expandedRows: Array.from(expandedOrders),
          renderExpanded: (order) => (
            <div className="p-8 bg-secondary/10 space-y-8 animate-in slide-in-from-top-4 duration-500 border-b border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Order Composition</h4>
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between bg-background p-4 border border-border/40 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 bg-muted relative overflow-hidden group">
                            <img
                              src={item.product.images?.[0] || "/Logo.png"}
                              alt={item.product.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-luxury-gradient opacity-10" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-heading">{item.product.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Quantity: {item.quantity}</p>
                            <p className="text-xs font-medium text-primary">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Summary */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Shipping Logistics</h4>
                    <div className="text-sm space-y-2 font-serif italic text-muted-foreground">
                      <p className="font-sans not-italic font-bold text-primary uppercase tracking-wider text-[10px]">{order.user?.name ?? order.customerName}</p>
                      <p>{order.street || "No address provided"}</p>
                      <p>{order.city}, {order.state} {order.zipCode}</p>
                      <p>{order.country}</p>
                      <p className="font-sans not-italic text-xs border-t border-border/50 pt-2 mt-2">
                        <span className="opacity-60 uppercase text-[9px] font-bold mr-2">Contact:</span>
                        {order.phone || "No phone provided"}
                      </p>
                    </div>

                    {(order.shippedAt || order.deliveredAt) && (
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        {order.shippedAt && (
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                            Shipped: <span className="text-primary ml-1">{format(new Date(order.shippedAt), "MMM dd, yyyy")}</span>
                          </p>
                        )}
                        {order.deliveredAt && (
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                            Delivered: <span className="text-primary ml-1">{format(new Date(order.deliveredAt), "MMM dd, yyyy")}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Financial Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs uppercase tracking-widest">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-xs uppercase tracking-widest text-primary">
                          <span>Privilege ({order.promoCode})</span>
                          <span>-₹{order.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator className="bg-border/30" />
                      <div className="flex justify-between text-base font-heading text-primary">
                        <span>Grand Total</span>
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[1px] w-full bg-border", className)} />;
}
