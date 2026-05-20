"use client";

import { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-heading tracking-tight">{title}</h1>
        <p className="text-muted-foreground font-serif italic">{description}</p>
      </div>
      {action}
    </div>
  );
}
