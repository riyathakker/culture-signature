"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "@/context/TranslationContext";
import { SectionTitle } from "@/components/common/SectionTitle";

export function Testimonials() {
  const { t } = useTranslation();
  const testimonials = t("home.testimonials.reviews") as unknown as any[];
  const [activeIndex, setActiveIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

  useEffect(() => {
    startSlider();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleManualChange = (idx: number) => {
    setActiveIndex(idx);

    // restart timer
    startSlider();
  };

  return (
    <section className="py-10 md:py-18 border-t border-border/50">
      <Container>
        <SectionTitle title={t("home.testimonials.title")} subtitle={t("home.testimonials.subtitle")} align="center" className="mb-16" />
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <Quote className="w-12 h-12 text-primary mx-auto mb-1 opacity-30" />

            <div className="relative h-64 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -120 }}
                  transition={{ duration: 0.7 }}
                  className="absolute w-full"
                >
                  <p className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-8">
                    "{testimonials && testimonials[activeIndex] ? testimonials[activeIndex].quote : ""}"
                  </p>

                  <div className="space-y-1">
                    <h4 className="text-luxury font-bold tracking-[0.3em]">
                      {testimonials && testimonials[activeIndex] ? testimonials[activeIndex].author : ""}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-4">
              {Array.isArray(testimonials) && testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleManualChange(idx)}
                  className={`w-12 h-0.5 transition-all duration-300 ${idx === activeIndex
                    ? "bg-primary scale-x-110"
                    : "bg-muted"
                    }`}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>
  );
}