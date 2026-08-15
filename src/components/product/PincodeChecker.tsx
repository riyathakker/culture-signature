"use client";

import { useState, useRef } from "react";
import { MapPin, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

const PINCODE_KEY = "cs_last_pincode";

function getDeliveryDays(pin: string): number {
  const first = parseInt(pin[0], 10);
  // Metro zones (1,2,4,6) → faster; remote (7,8,9) → slower
  if ([1, 2, 4, 6].includes(first)) return 3;
  if ([3, 5].includes(first)) return 4;
  return 6;
}

function addBusinessDays(days: number): string {
  const d = new Date();
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

type Status = "idle" | "loading" | "ok" | "error";

interface Result {
  pin: string;
  days: number;
  by: string;
}

export function PincodeChecker() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(PINCODE_KEY) ?? "" : ""
  );
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = () => {
    setOpen((v) => {
      if (!v) setTimeout(() => inputRef.current?.focus(), 60);
      return !v;
    });
  };

  const check = () => {
    const pin = input.trim();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setStatus("error");
      setResult(null);
      return;
    }
    setStatus("loading");
    // Simulate a short API round-trip
    setTimeout(() => {
      const days = getDeliveryDays(pin);
      const by = addBusinessDays(days);
      setResult({ pin, days, by });
      setStatus("ok");
      localStorage.setItem(PINCODE_KEY, pin);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") check();
  };

  return (
    <div className="border-t border-border/30 pt-3">
      {/* Toggle row */}
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between text-left gap-2 group"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary/60 flex-shrink-0" />
          <span className="text-xs uppercase tracking-widest font-bold">{t("shop.product.details.pincode.check")}</span>
          {result && status === "ok" && !open && (
            <span className="text-[10px] text-muted-foreground font-normal normal-case tracking-normal">
              — {t("shop.product.details.pincode.summary", { pin: result.pin, date: result.by })}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      {/* Expandable body */}
      <div className={`grid transition-all duration-200 ease-in-out ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="space-y-2">
            {/* Input row */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.replace(/\D/g, ""));
                  setStatus("idle");
                  setResult(null);
                }}
                onKeyDown={handleKey}
                placeholder={t("shop.product.details.pincode.placeholder")}
                className="flex-1 h-9 px-3 text-sm border border-border/60 rounded-sm bg-transparent outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
              />
              <button
                type="button"
                onClick={check}
                disabled={status === "loading" || input.length !== 6}
                className="h-9 px-4 text-[10px] uppercase tracking-widest font-bold border border-border/60 rounded-sm hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-40"
              >
                {status === "loading"
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : t("shop.product.details.pincode.checkBtn")}
              </button>
            </div>

            {/* Result */}
            {status === "ok" && result && (
              <div className="flex items-start gap-2 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>
                  <span className="text-green-700 font-bold">{t("shop.product.details.pincode.available")}</span>
                  {" — "}{t("shop.product.details.pincode.estimatedBy")}{" "}
                  <span className="font-bold">{result.by}</span>
                  <span className="text-muted-foreground"> {t("shop.product.details.pincode.businessDays", { count: result.days })}</span>
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 text-[11px] text-destructive">
                <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t("shop.product.details.pincode.invalid")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
