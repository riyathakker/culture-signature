"use client";

import {
  Download,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useOrderStore } from "@/store/orderStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

export default function AdminOrders() {
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

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
      render: (order) => `#${order.id.slice(-8).toUpperCase()}`,
    },
    {
      header: "Customer",
      render: (order) => (
        <div className="flex flex-col text-left">
          <span className="font-medium text-sm">{order.user.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{order.user.email}</span>
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
      render: (order) => formatPrice(order.total),
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Eye className="w-4 h-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Truck className="w-4 h-4" /> Mark as Shipped
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
              <XCircle className="w-4 h-4" /> Cancel Order
            </DropdownMenuItem>
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
      />
    </div>
  );
}
