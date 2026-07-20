"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "pwa_install_dismissed";
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed as PWA — hide
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_TTL) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferredPrompt) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  return (
    <div className="fixed bottom-20 left-3 right-3 z-[100] md:left-auto md:right-5 md:max-w-sm animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-background border border-border/60 rounded-sm shadow-2xl shadow-black/20 p-4 flex items-center gap-3">
        <div className="w-11 h-11 bg-primary/10 rounded-sm flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest">Add to Home Screen</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            Install Culture Signature for the best experience
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleInstall}
            size="sm"
            className="h-8 px-3 text-[10px] uppercase tracking-widest"
          >
            Install
          </Button>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
