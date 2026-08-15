"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useTranslation } from "@/context/TranslationContext";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useReviewStore } from "@/store/reviewStore";

type Testimonial = { quote: string; author: string };

export function Testimonials() {
  const { t } = useTranslation();
  const featuredReviews = useReviewStore((s) => s.featuredReviews);
  const fetchFeaturedReviews = useReviewStore((s) => s.fetchFeaturedReviews);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedReviews();
  }, [fetchFeaturedReviews]);

  // Latest, highly-rated reviews pulled from real customer feedback.
  const testimonials: Testimonial[] = useMemo(() => {
    if (featuredReviews.length > 0) {
      return featuredReviews.map((r) => ({
        quote: r.comment ?? "",
        author: r.user?.name || t("home.testimonials.anonymous"),
      }));
    }
    return [];
  }, [featuredReviews, t]);

  const count = testimonials.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (count <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 4000);
  };

  // Restart the auto-play whenever the source list changes.
  useEffect(() => {
    startSlider();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Clamp during render so a shrinking list never points past the end.
  const safeIndex = count ? activeIndex % count : 0;

  const handleManualChange = (idx: number) => {
    setActiveIndex(idx);

    // restart timer
    startSlider();
  };

  if (count === 0) return null;

  const current = testimonials[safeIndex];

  return (
    <section className="py-14 border-t border-border/50 bg-background">
      <Container>
        <SectionTitle title={t("home.testimonials.title")} subtitle={t("home.testimonials.subtitle")} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border/60 bg-card px-4 py-6 md:px-10 md:py-10 shadow-sm">
            {/* Oversized decorative quote mark */}
            <Quote className="absolute -top-5 left-8 w-12 h-12 text-primary/20 fill-primary/10" aria-hidden />

            <div className="relative min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="w-full text-center"
                >
                  <p className="text-lg md:text-2xl font-serif italic leading-relaxed text-foreground/90">
                    {current ? current.quote : ""}
                  </p>

                  <div className="mt-6 md:mt-10 flex flex-col items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-heading text-base uppercase">
                      {current?.author ? current.author[0] : ""}
                    </span>
                    <h4 className="text-luxury text-xs font-bold tracking-[0.3em]">
                      {current ? current.author : ""}
                    </h4>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {count > 1 && (
            <div className="mt-8 flex justify-center gap-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Testimonial ${idx + 1}`}
                  onClick={() => handleManualChange(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === safeIndex
                    ? "w-8 bg-primary"
                    : "w-1.5 bg-muted hover:bg-muted-foreground/40"
                    }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}