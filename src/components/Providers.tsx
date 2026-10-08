"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TranslationProvider } from "@/context/TranslationContext";
import { Suspense } from "react";
import { MotionConfig } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <SessionProvider>
      <TranslationProvider>
        {/* reducedMotion="user" makes every framer-motion animation respect the
            viewer's OS "reduce motion" setting automatically. */}
        <MotionConfig reducedMotion="user">
          {children}
          <Toaster position="top-right" richColors closeButton />
        </MotionConfig>
      </TranslationProvider>
    </SessionProvider>
    </Suspense>
  );
}
