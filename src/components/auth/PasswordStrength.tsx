"use client";

import { getPasswordStrength, MIN_PASSWORD_LENGTH } from "@/lib/passwordStrength";
import { cn } from "@/lib/utils";

const BAR_COLORS = ["bg-muted", "bg-destructive", "bg-amber-500", "bg-amber-400", "bg-success"];

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, meetsMinimum } = getPasswordStrength(password);

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= score ? BAR_COLORS[score] : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className="text-[11px] tracking-wide flex items-center justify-between">
        <span className={cn("font-bold uppercase", meetsMinimum ? "text-muted-foreground" : "text-destructive")}>
          {label}
        </span>
        {!meetsMinimum && (
          <span className="text-muted-foreground/70 normal-case tracking-normal">
            Min {MIN_PASSWORD_LENGTH} characters
          </span>
        )}
      </p>
    </div>
  );
}
