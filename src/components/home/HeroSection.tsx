"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden pwa-hide">
      {/* Warm editorial background — cream drifting into a soft rust wash */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-secondary via-background to-accent" />
      {/* Ambient rust glows for depth */}
      <div className="absolute -top-40 -right-40 -z-10 h-[540px] w-[540px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="absolute -bottom-52 -left-44 -z-10 h-[540px] w-[540px] rounded-full bg-primary/[0.06] blur-[130px]" />
      {/* Oversized logo watermark */}
      <img
        src="/Logo_Without_Text.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[-6%] top-1/2 -z-10 hidden w-[48%] max-w-[660px] -translate-y-1/2 opacity-[0.06] md:block"
      />

      <Container className="relative">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-luxury mb-6 block"
          >
            {t("home.hero.established")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-8 font-heading text-4xl md:text-4xl lg:text-6xl leading-[0.92] tracking-tighter text-foreground"
          >
            {t("home.hero.title1")} <br />
            <span className="italic text-primary">{t("home.hero.title2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 max-w-2xl font-serif text-lg md:text-xl italic leading-relaxed text-muted-foreground"
          >
            {t("home.hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href={ROUTES.COLLECTIONS} className="btn-luxury">
              {t("home.hero.cta")}
            </Link>
            <Link href={ROUTES.ABOUT_US} className="btn-luxury-outline">
              {t("home.hero.ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
