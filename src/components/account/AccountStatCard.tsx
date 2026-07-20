import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AccountStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href: string;
  linkText?: string;
  className?: string;
}

export function AccountStatCard({
  label,
  value,
  icon: Icon,
  href,
  linkText = "View All",
  className
}: AccountStatCardProps) {
  return (
    <div className={cn(
      "bg-background border p-6 rounded-sm space-y-4 hover:border-primary/50 transition-colors group",
      className
    )}>
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-spaced-bold font-bold text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-heading">{value}</h3>
      </div>
      <Link
        href={href}
        className="text-spaced-bold font-bold text-primary hover:opacity-70 flex items-center gap-1 group-hover:gap-2 transition-all"
      >
        {linkText} <span className="text-xs">→</span>
      </Link>
    </div>
  );
}
