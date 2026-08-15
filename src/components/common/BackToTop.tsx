"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";

export function BackToTop() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (isAdminPage) return null;

  const scrollToTop = () => {
    const duration = 500; // ms
    const start = window.pageYOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={cn(
            "fixed right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110 active:scale-95 group overflow-hidden",
            "bottom-8 pwa-back-to-top"
          )}
          aria-label={t("common.backToTop")}
        >
          <div className="absolute inset-0 bg-luxury-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
