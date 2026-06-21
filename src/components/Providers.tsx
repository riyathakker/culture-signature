"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TranslationProvider } from "@/context/TranslationContext";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
    <SessionProvider>
      <TranslationProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </TranslationProvider>
    </SessionProvider>
    </Suspense>
  );
}
