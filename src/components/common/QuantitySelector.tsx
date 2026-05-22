import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onUpdate: (newQuantity: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  min?: number;
  max?: number;
}

export function QuantitySelector({
  quantity,
  onUpdate,
  className,
  size = "md",
  min = 0,
  max = Infinity,
}: QuantitySelectorProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const decrement = () => {
    if (quantity > min) onUpdate(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onUpdate(quantity + 1);
  };

  return (
    <div className={cn(
      "flex items-center border rounded-sm overflow-hidden bg-background",
      isSm ? "h-8" : isLg ? "h-14" : "h-10",
      className
    )}>
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= min}
        className={cn(
          "hover:bg-secondary transition-colors flex items-center justify-center h-full disabled:opacity-30 disabled:cursor-not-allowed",
          isSm ? "w-8" : isLg ? "w-12" : "w-10"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={cn(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>

      <span className={cn(
        "font-medium text-center flex-1 tabular-nums",
        isSm ? "text-xs" : isLg ? "text-base" : "text-sm"
      )}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        className={cn(
          "hover:bg-secondary transition-colors flex items-center justify-center h-full disabled:opacity-30 disabled:cursor-not-allowed",
          isSm ? "w-8" : isLg ? "w-12" : "w-10"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={cn(isSm ? "w-3 h-3" : "w-4 h-4")} />
      </button>
    </div>
  );
}
