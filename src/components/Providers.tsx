"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { TranslationProvider } from "@/context/TranslationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TranslationProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </TranslationProvider>
    </SessionProvider>
  );
}
