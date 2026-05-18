import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onUpdate: (newQuantity: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function QuantitySelector({ 
  quantity, 
  onUpdate, 
  className,
  size = "md" 
}: QuantitySelectorProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className={cn(
      "flex items-center border rounded-sm overflow-hidden bg-background",
      isSm ? "h-8" : isLg ? "h-14" : "h-10",
      className
    )}>
      <button
        onClick={() => onUpdate(quantity - 1)}
        className={cn(
          "hover:bg-secondary transition-colors flex items-center justify-center h-full",
          isSm ? "w-8" : isLg ? "w-12" : "w-10"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={cn(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>
      
      <span className={cn(
        "font-medium text-center flex-1",
        isSm ? "text-xs" : isLg ? "text-base" : "text-sm"
      )}>
        {quantity}
      </span>
      
      <button
        onClick={() => onUpdate(quantity + 1)}
        className={cn(
          "hover:bg-secondary transition-colors flex items-center justify-center h-full",
          isSm ? "w-8" : isLg ? "w-12" : "w-10"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={cn(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>
    </div>
  );
}
