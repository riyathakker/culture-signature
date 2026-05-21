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
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { TablePagination } from "@/components/admin/TablePagination";
import { usePagination } from "@/hooks/usePagination";

export default function AdminOrders() {
  const { orders, totalOrders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData: paginatedOrders,
    totalItems,
  } = usePagination({
    data: orders,
    totalItems: totalOrders,
    isServerSide: true,
    dependencies: [searchQuery, activeStatus],
  });

  useEffect(() => {
    fetchOrders(true, {
      page: currentPage,
      limit: pageSize,
      query: searchQuery,
      status: activeStatus,
    });
  }, [currentPage, pageSize, searchQuery, activeStatus, fetchOrders]);

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
          {order.items && order.items.slice(0, 3).map((item: any) => (
            <ImageLightbox
              key={item.id}
              src={item.product.images?.[0]}
              alt={item.product.name}
              images={item.product.images}
              className="relative inline-block h-8 w-8 rounded-full ring-2 ring-background overflow-hidden bg-muted"
              imgClassName="h-full w-full object-cover"
            />
          ))}
          {order.items && order.items.length > 3 && (
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
        data={paginatedOrders}
        isLoading={isLoading}
        emptyMessage="No orders found matching your criteria."
        rowKey={(o) => o.id}
        mobileCard={(order) => (
          <div>
            <div className="bg-background border border-border/50 rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    {expandedOrders.has(order.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  <span className="font-bold text-xs">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background border border-border/50 shadow-xl">
                      <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                        <Eye className="w-4 h-4" /> {expandedOrders.has(order.id) ? "Hide Details" : "View Details"}
                      </DropdownMenuItem>
                      {order.status !== "SHIPPED" && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => updateOrderStatus(order.id, "SHIPPED")}>
                          <Truck className="w-4 h-4" /> Mark as Shipped
                        </DropdownMenuItem>
                      )}
                      {order.status === "SHIPPED" && (
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => updateOrderStatus(order.id, "DELIVERED")}>
                          <CheckCircle2 className="w-4 h-4" /> Mark as Delivered
                        </DropdownMenuItem>
                      )}
                      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={() => updateOrderStatus(order.id, "CANCELLED")}>
                          <XCircle className="w-4 h-4" /> Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {order.items && order.items.slice(0, 3).map((item: any) => (
                    <ImageLightbox
                      key={item.id}
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="h-8 w-8 rounded-full ring-2 ring-background overflow-hidden bg-muted"
                      imgClassName="h-full w-full object-cover"
                    />
                  ))}
                  {order.items && order.items.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-bold ring-2 ring-background">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{order.user?.name ?? order.customerName}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{order.user?.email ?? ""}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2">
                <span className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
                <span className="font-bold">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
            {expandedOrders.has(order.id) && (
              <div className="p-6 bg-secondary/10 space-y-6 animate-in slide-in-from-top-4 duration-500 border border-t-0 border-border/50 rounded-b-sm">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Order Items</h4>
                  <div className="space-y-3">
                    {(order.items ?? []).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between bg-background p-3 border border-border/40">
                        <div className="flex items-center gap-3">
                          <ImageLightbox
                            src={item.product.images?.[0]}
                            alt={item.product.name}
                            className="w-12 h-16 bg-muted overflow-hidden flex-shrink-0"
                            imgClassName="w-full h-full object-cover"
                          />
                          <div className="space-y-0.5">
                            <p className="text-sm font-heading">{item.product.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                            <p className="text-xs font-medium text-primary">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Shipping</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p className="font-sans font-bold text-primary uppercase tracking-wider text-[10px]">{order.user?.name ?? order.customerName}</p>
                    <p>{order.street || "No address provided"}</p>
                    <p>{order.city}, {order.state} {order.zipCode}</p>
                    <p>{order.country}</p>
                    <p className="text-xs pt-1">
                      <span className="opacity-60 uppercase text-[9px] font-bold mr-2">Contact:</span>
                      {order.phone || "No phone provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-border/50 pt-4">
                  <div className="flex justify-between text-xs uppercase tracking-widest">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-xs uppercase tracking-widest text-primary">
                      <span>{order.promoCode}</span>
                      <span>-₹{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-heading text-primary border-t border-border/30 pt-2">
                    <span>Grand Total</span>
                    <span>₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        expandable={{
          expandedRows: Array.from(expandedOrders),
          renderExpanded: (order) => (
            <div className="p-8 bg-secondary/10 space-y-8 animate-in slide-in-from-top-4 duration-500 border-b border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Order Items */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Order Composition</h4>
                  <div className="space-y-3">
                    {(order.items ?? []).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between bg-background p-4 border border-border/40 shadow-sm">
                        <div className="flex items-center gap-4">
                          <ImageLightbox
                            src={item.product.images?.[0]}
                            alt={item.product.name}
                            images={item.product.images}
                            className="w-16 h-20 bg-muted overflow-hidden"
                            imgClassName="w-full h-full object-cover"
                          />
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
                          <p className="text-spaced-bold text-muted-foreground font-bold">
                            Shipped: <span className="text-primary ml-1">{format(new Date(order.shippedAt), "MMM dd, yyyy")}</span>
                          </p>
                        )}
                        {order.deliveredAt && (
                          <p className="text-spaced-bold text-muted-foreground font-bold">
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
                          <span>{order.promoCode}</span>
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

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[1px] w-full bg-border", className)} />;
}
