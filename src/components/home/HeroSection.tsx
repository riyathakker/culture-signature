"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { en } from "@/locales/en";

export function HeroSection() {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/200/300"
          alt={en.home.hero.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="w-full h-full bg-luxury-gradient opacity-20 relative z-0" />
      </div>

      <Container className="relative z-20">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-luxury text-primary block mb-6 uppercase tracking-[0.5em] text-sm font-bold mt-10"
          >
            {en.home.hero.established}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-heading text-white mb-8 tracking-tighter leading-none"
          >
            {en.home.hero.title1} <br /> <span className="italic">{en.home.hero.title2}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 font-serif italic mb-10 leading-relaxed max-w-2xl"
          >
            {en.home.hero.description}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
