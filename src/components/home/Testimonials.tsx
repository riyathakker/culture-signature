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
        author: r.user?.name || "Anonymous",
      }));
    }
    return [];
  }, [featuredReviews]);

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

  // Nothing to show until real reviews exist — hide the section entirely.
  if (count === 0) return null;

  return (
    <section className="py-10 border-t border-border/50">
      <Container>
        <SectionTitle title={t("home.testimonials.title")} subtitle={t("home.testimonials.subtitle")} align="center" className="mb-8" />
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <Quote className="w-12 h-12 text-primary mx-auto mb-1 opacity-30" />

          <div className="relative min-h-42 flex items-center justify-center overflow-hidden mb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <p className="text-2xl font-serif italic leading-relaxed mb-4">
                  &ldquo;{testimonials[safeIndex] ? testimonials[safeIndex].quote : ""}&rdquo;
                </p>

                <div className="space-y-1">
                  <h4 className="text-luxury font-bold tracking-[0.3em]">
                    {testimonials[safeIndex] ? testimonials[safeIndex].author : ""}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleManualChange(idx)}
                className={`w-12 h-0.5 transition-all duration-300 ${idx === safeIndex
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