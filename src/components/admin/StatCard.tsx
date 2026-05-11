import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ label, value, trend, trendType, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-background border border-border/50 p-6 rounded-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
          trendType === "up" ? "bg-green-500/10 text-green-500" : 
          trendType === "down" ? "bg-red-500/10 text-red-500" : 
          "bg-muted text-muted-foreground"
        )}>
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-heading tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
