import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function NoImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 bg-secondary/30 text-muted-foreground w-full h-full",
        className
      )}
    >
      <ImageOff className="w-6 h-6 opacity-50" />
      <span className="text-[10px] uppercase tracking-widest">No image</span>
    </div>
  );
}
