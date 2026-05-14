"use client";

import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminPage) return null;

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-40 transition-all duration-500",
      isScrolled ? "-translate-y-[40px]" : "translate-y-0"
    )}>
      <AnimatePresence>
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="h-[40px] overflow-hidden"
          >
            <AnnouncementBar />
          </motion.div>
      </AnimatePresence>
      <div className="bg-background border-b shadow-sm">
        <Navbar />
      </div>
    </header>
  );
}
