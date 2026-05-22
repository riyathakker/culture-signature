"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export function MobileFloatingCart() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  const isAdminPage = pathname?.startsWith("/admin");
  const isBagPage = pathname === ROUTES.SHOPPING_BAG || pathname?.startsWith("/bag/checkout");

  useEffect(() => {
    const handleScroll = () => {
      setIsBackToTopVisible(window.pageYOffset > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (itemCount === 0 || isAdminPage || isBagPage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          bottom: isBackToTopVisible ? "6rem" : "2rem" 
        }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed right-8 z-50 md:hidden"
      >
        <Link href={ROUTES.SHOPPING_BAG}>
          <button 
            className="p-4 rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110 active:scale-95 group overflow-hidden relative"
            aria-label="Go to shopping bag"
          >
            <div className="absolute inset-0 bg-luxury-gradient opacity-20 group-hover:opacity-40 transition-opacity" />
            <ShoppingBag className="w-5 h-5 relative z-10" />
            <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border border-primary/10">
              {itemCount}
            </span>
          </button>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
