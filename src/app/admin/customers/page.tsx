"use client";

import {
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useCustomerStore } from "@/store/customerStore";
import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";

export default function AdminCustomers() {
  const { customers, isLoading, fetchCustomers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = 
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !activeRole || customer.role === activeRole;

      return matchesSearch && matchesRole;
    });
  }, [customers, searchQuery, activeRole]);

  const columns: Column<any>[] = [
    {
      header: "Connoisseur",
      render: (customer) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
            {customer.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm tracking-tight">{customer.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{customer.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (customer) => (
        <Badge 
          variant="outline" 
          className={cn(
            "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2",
            customer.role === "ADMIN" ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/30 text-muted-foreground bg-muted/5"
          )}
        >
          {customer.role}
        </Badge>
      ),
    },
    {
      header: "Joined",
      className: "text-muted-foreground text-xs",
      render: (customer) => format(new Date(customer.createdAt), "MMM dd, yyyy"),
    },
    {
      header: "Total Orders",
      headerClassName: "text-center",
      className: "text-center font-medium",
      render: (customer) => customer.orders?.length || 0,
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <AdminPageHeader 
        title="Customers"
        description="Manage your community of luxury connoisseurs."
      />

      <AdminFilterBar 
        searchPlaceholder="Search by name or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <AdminFilterDropdown 
          label="Role"
          icon={Filter}
          options={[
            { label: "Admin", value: "ADMIN" },
            { label: "User", value: "USER" }
          ]}
          selectedValue={activeRole}
          onSelect={setActiveRole}
          allLabel="All Roles"
        />
      </AdminFilterBar>

      <AdminTable
        columns={columns}
        data={filteredCustomers}
        isLoading={isLoading}
        emptyMessage="No customers found matching your criteria."
        rowKey={(c) => c.id}
        mobileCard={(customer) => (
          <div className="bg-background border border-border/50 rounded-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm tracking-tight">{customer.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] tracking-widest font-bold h-5 uppercase rounded-none px-2 flex-shrink-0",
                    customer.role === "ADMIN"
                      ? "border-primary text-primary bg-primary/5"
                      : "border-muted-foreground/30 text-muted-foreground bg-muted/5"
                  )}
                >
                  {customer.role}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{customer.email}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                <span>{customer.orders?.length || 0} orders</span>
                <span>·</span>
                <span>Joined {format(new Date(customer.createdAt), "MMM yyyy")}</span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
