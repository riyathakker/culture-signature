"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Shared easing used across the home sections (Categories, Hero, Testimonials)
// so every reveal in the app feels like it belongs to the same system.
const LUXURY_EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Vertical offset (px) the element rises from. Keep small for a subtle feel. */
  y?: number;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Replay every time it scrolls into view instead of only once. */
  replay?: boolean;
}

/**
 * Subtle fade-up reveal for a single element (section headings, banners, blocks).
 * Animates once as it scrolls into view.
 */
export function Reveal({
  y = 16,
  delay = 0,
  duration = 0.55,
  replay = false,
  className,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !replay, margin: "-60px" }}
      transition={{ duration, delay, ease: LUXURY_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps extends HTMLMotionProps<"div"> {
  /** Position in the grid/list — drives the staggered delay. */
  index?: number;
  /** Per-item stagger step in seconds. */
  step?: number;
  /** Cap the stagger so long grids don't delay forever. */
  staggerCap?: number;
  y?: number;
}

/**
 * Grid/list item reveal. Pass the map index and items fade-up in sequence.
 * The stagger wraps at `staggerCap` so the last card never lags noticeably.
 */
export function RevealItem({
  index = 0,
  step = 0.06,
  staggerCap = 6,
  y = 18,
  className,
  children,
  ...props
}: RevealItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (index % staggerCap) * step,
        ease: LUXURY_EASE,
      }}
      className={cn("h-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
