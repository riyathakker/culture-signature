"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Simple seconds countdown for things like OTP resend cooldowns.
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback((from: number) => {
    clear();
    setSeconds(from);
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clear();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { seconds, start };
}
