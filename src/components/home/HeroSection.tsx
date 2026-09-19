"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const HERO_IMAGE_POOL = [
  "/hero/hero_image1.png",
  "/hero/hero_image2.png",
  "/hero/hero_image3.png",
  "/hero/hero_image5.png",
  "/hero/hero_image6.png",
  "/hero/hero_image7.png",
];

const FLOAT_COUNT = 4;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// `sequence` is the slot's position in the clockwise load-in order:
// top-left -> top-right -> bottom-right -> bottom-left.
const SLOTS = [
  { position: "top-2 left-0 sm:left-4 lg:left-16", size: "w-28 h-36 sm:w-36 sm:h-48 lg:w-44 lg:h-60", rotate: "-rotate-6", sequence: 0 },
  { position: "top-0 right-0 sm:right-4 lg:right-16", size: "w-28 h-36 sm:w-36 sm:h-48 lg:w-44 lg:h-60", rotate: "rotate-6", sequence: 1 },
  { position: "bottom-0 left-6 sm:left-12 lg:left-28", size: "w-24 h-32 sm:w-32 sm:h-44 lg:w-40 lg:h-52", rotate: "rotate-3", translate: "translate-y-1/3", sequence: 3 },
  { position: "bottom-2 right-2 sm:right-16 lg:right-32", size: "w-24 h-32 sm:w-28 sm:h-36 lg:w-36 lg:h-48", rotate: "-rotate-3", sequence: 2 },
];

export function HeroSection() {
  const { t } = useTranslation();
  const [images, setImages] = useState(() => HERO_IMAGE_POOL.slice(0, FLOAT_COUNT));

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setImages(shuffle(HERO_IMAGE_POOL).slice(0, FLOAT_COUNT));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative overflow-hidden pwa-hide bg-accent">
      <div className="relative flex h-[calc(100vh-100px)] items-center justify-center md:h-[calc(100vh-115px)]">
        {images.map((src, i) => {
          const slot = SLOTS[i];
          return (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + slot.sequence * 0.15, ease: "easeOut" }}
              className={cn(
                "absolute z-10 overflow-hidden rounded-2xl bg-gradient-to-b from-white/0 to-white shadow-xl ring-1 ring-white/60",
                slot.position,
                slot.size,
                slot.rotate,
                slot.translate
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="220px"
                className="object-cover"
              />
            </motion.div>
          );
        })}

        <div className="relative z-20 flex w-full flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-luxury mb-2 block"
          >
            {t("home.hero.established")}
          </motion.span>

          <div
            aria-hidden
            className="pointer-events-none select-none whitespace-nowrap font-sans text-[clamp(2.75rem,11vw,7rem)] leading-[0.85] font-bold tracking-tight text-primary/10 uppercase"
          >
            {t("home.hero.signatureLine1")}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative z-10 -my-[0.3em] whitespace-nowrap px-6 font-heading text-[clamp(1.75rem,5vw,3.75rem)] leading-[0.95] tracking-tighter text-foreground"
          >
            <span className="italic">{t("home.hero.title2")}</span>
          </motion.h1>

          <div
            aria-hidden
            className="pointer-events-none select-none whitespace-nowrap font-sans text-[clamp(2.75rem,11vw,7rem)] leading-[0.85] font-bold tracking-tight text-primary/10 uppercase"
          >
            {t("home.hero.signatureLine2")}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-2 flex flex-wrap items-center justify-center gap-6 px-6"
          >
            <Link
              href={ROUTES.COLLECTIONS}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {t("home.hero.cta")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={ROUTES.ABOUT_US}
              className="text-xs font-bold tracking-[0.2em] text-foreground uppercase underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
            >
              {t("home.hero.ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
