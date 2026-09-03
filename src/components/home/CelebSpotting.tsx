"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";
import { usePWA } from "@/hooks/usePWA";

const DEFAULT_IMAGES = [
  "/celebs/celeb-1.jpg",
  "/celebs/celeb-2.jpg",
  "/celebs/celeb-3.jpg",
  "/celebs/celeb-4.jpg",
  "/celebs/celeb-5.jpg",
  "/celebs/celeb-6.jpg",
  "/celebs/celeb-7.jpg",
  "/celebs/celeb-8.jpg",
];

// ── Desktop: CSS marquee (unchanged) ─────────────────────────────────────────

function DesktopMarquee({ images, onSelect }: { images: string[]; onSelect: (s: string) => void }) {
  const { t } = useTranslation();
  const marqueeImgs = [...images, ...images];
  return (
    <div className="relative mt-10 w-full flex overflow-x-hidden">
      <div className="flex animate-marquee whitespace-nowrap gap-4 px-2 w-max">
        {marqueeImgs.map((src, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(src)}
            className="relative w-64 h-[320px] flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
          >
            <img
              src={src}
              alt={t("home.celebSpotting.imageAlt")}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PWA: manual drag + JS auto-scroll ────────────────────────────────────────

function PWAScroller({ images, onSelect }: { images: string[]; onSelect: (s: string) => void }) {
  const { t } = useTranslation();
  const trackImages = [...images, ...images, ...images]; // triple for seamless loop
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Auto-scroll
  const startAuto = useCallback(() => {
    autoRef.current = window.setInterval(() => {
      if (!scrollRef.current || isDragging.current) return;
      const el = scrollRef.current;
      el.scrollLeft += 1;
      // seamless: when we reach 2/3, jump back to 1/3 mark
      const third = el.scrollWidth / 3;
      if (el.scrollLeft >= third * 2) el.scrollLeft -= third;
    }, 16);
  }, []);

  const stopAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
  }, []);

  useEffect(() => {
    // start offset at 1/3 so we have room to scroll left
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
    }
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollRef.current!.scrollLeft;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].pageX - startX.current;
    scrollRef.current!.scrollLeft = scrollLeft.current - dx;
  };
  const onTouchEnd = () => { isDragging.current = false; };

  // Mouse drag (for dev preview)
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollLeft.current = scrollRef.current!.scrollLeft;
    scrollRef.current!.style.cursor = "grabbing";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.pageX - startX.current;
    scrollRef.current!.scrollLeft = scrollLeft.current - dx;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto gap-3 px-4 pb-3 mt-8 no-scrollbar cursor-grab select-none"
      style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "auto" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {trackImages.map((src, idx) => (
        <div
          key={idx}
          onClick={() => !isDragging.current && onSelect(src)}
          className="pwa-celeb-card relative w-40 h-[240px] flex-shrink-0 rounded-lg overflow-hidden"
        >
          <img
            src={src}
            alt={t("home.celebSpotting.imageAlt")}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function CelebSpotting() {
  const { t } = useTranslation();
  const isPWA = usePWA();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/celebs")
      .then((r) => r.json())
      .then((d) => {
        // Use the Cloudinary "celebs" folder when it has images; otherwise keep
        // the bundled defaults so the section is never empty.
        if (!cancelled && Array.isArray(d.images) && d.images.length > 0) {
          setImages(d.images);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Nothing to show (no Cloudinary images and no defaults) → hide the section.
  if (images.length === 0) return null;

  return (
    <>
      <section className="py-10 pwa-section overflow-hidden bg-accent border-t border-border/50">
        <SectionTitle
          title={t("home.celebSpotting.title")}
          subtitle={t("home.celebSpotting.subtitle")}
          align="center"
        />

        {isPWA ? (
          <PWAScroller images={images} onSelect={setSelectedImage} />
        ) : (
          <DesktopMarquee images={images} onSelect={setSelectedImage} />
        )}
      </section>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedImage}
            alt={t("home.celebSpotting.fullscreenAlt")}
            className="max-w-full max-h-full object-contain rounded-md animate-in fade-in zoom-in-95 duration-300"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-4xl leading-none"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
