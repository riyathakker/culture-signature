"use client";

import { ClipboardList, CreditCard, Truck, PackageCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";

const STEPS = [
  { status: "PENDING",   labelKey: "account.orders.tracker.placed",    icon: ClipboardList },
  { status: "PAID",      labelKey: "account.orders.tracker.paid",      icon: CreditCard },
  { status: "SHIPPED",   labelKey: "account.orders.tracker.shipped",   icon: Truck },
  { status: "DELIVERED", labelKey: "account.orders.tracker.delivered", icon: PackageCheck },
];

const ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

interface Props {
  status: string;
  createdAt?: string;
}

export function OrderTracker({ status, createdAt }: Props) {
  const { t } = useTranslation();
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-sm border border-destructive/30 bg-destructive/5">
        <XCircle className="w-5 h-5 text-destructive shrink-0" />
        <div>
          <p className="text-sm font-bold text-destructive uppercase tracking-widest">{t("account.orders.tracker.cancelled")}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t("account.orders.tracker.cancelledDesc")}
          </p>
        </div>
      </div>
    );
  }

  const activeIdx = ORDER.indexOf(status);

  return (
    <div className="py-5 px-1">
      <div className="relative flex items-start justify-between">
        {/* Progress line — sits behind the step circles */}
        <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-border/40 -z-0" />
        <div
          className="absolute top-[18px] left-0 h-[2px] bg-primary transition-all duration-700 -z-0"
          style={{ width: activeIdx === 0 ? "0%" : `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center gap-2 z-10" style={{ width: `${100 / STEPS.length}%` }}>
              {/* Circle */}
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                done  && "bg-primary border-primary text-primary-foreground",
                active && "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                !done && !active && "bg-background border-border/40 text-muted-foreground/40"
              )}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <div className="text-center px-1">
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest leading-tight",
                  (done || active) ? "text-foreground" : "text-muted-foreground/50"
                )}>
                  {t(step.labelKey)}
                </p>
                {active && (
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">
                    {t("account.orders.tracker.current")}
                  </p>
                )}
                {done && i === 0 && createdAt && (
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
