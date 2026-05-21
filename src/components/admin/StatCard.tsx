import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
}

export function StatCard({ label, value, trend, icon: Icon }: StatCardProps) {
  const trendType = trend == null ? "neutral" : trend > 0 ? "up" : trend < 0 ? "down" : "neutral";
  const trendLabel = trend == null ? null : `${trend > 0 ? "+" : ""}${trend}% vs last month`;

  return (
    <div className="bg-background border border-border/50 p-6 rounded-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        {trendLabel && (
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
            trendType === "up" ? "bg-green-500/10 text-green-500" :
            trendType === "down" ? "bg-red-500/10 text-red-500" :
            "bg-muted text-muted-foreground"
          )}>
            {trendLabel}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-spaced-bold text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-heading tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
