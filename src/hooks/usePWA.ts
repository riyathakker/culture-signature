"use client";

import { useEffect, useState } from "react";

export function usePWA() {
  const [isPWA, setIsPWA] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsPWA(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPWA(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isPWA;
}
