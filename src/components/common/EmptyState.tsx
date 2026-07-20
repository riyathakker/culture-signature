"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
    >
      <div className="relative w-24 h-24">
        <div className="w-full h-full bg-secondary/30 rounded-full flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary/30" />
        </div>
        <div className="absolute inset-0 bg-luxury-gradient opacity-10 rounded-full" />
        <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping" />
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        <h2 className="text-3xl font-heading">{title}</h2>
        <p className="muted-italic">{description}</p>
      </div>

      {action && (
        <Link href={action.href}>
          <Button className="py-4 px-8 uppercase tracking-[0.2em] text-xs h-auto gap-2">
            {action.label} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
