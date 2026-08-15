"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Clock, Camera, CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { Product, Exhibition } from "@/types";
import { cn } from "@/lib/utils";
import { getExhibitionStatus, exhibitionMapsUrl, parsePlace } from "@/lib/exhibition";

function formatTime(t: string) {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  if (Number.isNaN(h)) return t;
  const m = Number(mStr) || 0;
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (start && end) return `${formatTime(start)} – ${formatTime(end)}`;
  return start ? formatTime(start) : end ? formatTime(end) : "";
}

function formatDateRange(date: string | Date, endDate?: string | Date | null) {
  const d = new Date(date);
  if (!endDate) return format(d, "d MMM yyyy");
  const e = new Date(endDate);
  const sameMonth = d.getMonth() === e.getMonth() && d.getFullYear() === e.getFullYear();
  return sameMonth ? `${format(d, "d")} – ${format(e, "d MMM")}` : `${format(d, "d MMM")} – ${format(e, "d MMM")}`;
}

// ─── Limited drops ────────────────────────────────────────────────────────────

function LimitedDropsStrip({ drops }: { drops: Product[] }) {
  const { t } = useTranslation();
  if (!drops.length) return null;
  return (
    <section className="py-10 bg-muted/50 border-y border-border/40">
      <Container>
        <SectionTitle title={t("home.limitedDrops.title")} subtitle={t("home.limitedDrops.subtitle")} />

        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {drops.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative min-w-[160px] max-w-[160px] md:min-w-[220px] md:max-w-[220px] flex-shrink-0"
            >
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="text-[8px] uppercase tracking-widest font-bold bg-primary text-primary-foreground px-2 py-1">
                    {t("home.limitedDrops.stockLeft", { count: product.stock })}
                  </span>
                </div>
              )}
              <ProductCard product={product} hideActions={true} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Exhibitions ──────────────────────────────────────────────────────────────

function ExhibitionCard({ ex, i }: { ex: Exhibition; i: number }) {
  const { t } = useTranslation();
  const images = ex.images ?? [];
  const [idx, setIdx] = useState(0);
  const derivedStatus = getExhibitionStatus(ex.date, ex.endDate);
  const place = parsePlace(ex.location);
  const city = ex.city || place.city;
  const timeRange = formatTimeRange(ex.startTime, ex.endTime);

  // Auto-advance the image carousel when the card has more than one image.
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIdx((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-shrink-0 group relative flex flex-col w-[280px] h-[500px] rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-500 hover:border-border hover:shadow-md hover:-translate-y-1"
    >
      {/* Image carousel — square (height matches the card width) */}
      <div className="relative shrink-0 overflow-hidden bg-secondary aspect-square">
        {images.length > 0 ? (
          <ImageLightbox
            src={images[idx]}
            alt={ex.title}
            images={images}
            initialIndex={idx}
            className="absolute inset-0 h-full w-full"
          >
            {images.map((src, k) => (
              <img
                key={k}
                src={src}
                alt={ex.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                  k === idx ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </ImageLightbox>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Camera className="w-9 h-9 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlays sit above the image but let clicks fall through to open the lightbox */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Status badge */}
        <span className={cn(
          "pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border backdrop-blur-md",
          derivedStatus === "ONGOING" ? "border-green-300/40 text-green-100 bg-green-500/20" :
            derivedStatus === "UPCOMING" ? "border-blue-300/40 text-blue-100 bg-blue-500/20" :
              "border-white/15 text-white/50 bg-black/30"
        )}>
          {derivedStatus === "ONGOING" && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse flex-shrink-0" />
          )}
          {t(`home.exhibitions.status.${derivedStatus.toLowerCase()}`)}
        </span>

        {/* Carousel dots */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {images.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={t("home.exhibitions.imageAria", { n: k + 1 })}
                onClick={() => setIdx(k)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 bg-white",
                  k === idx ? "w-4 opacity-90" : "w-1.5 opacity-40 hover:opacity-70"
                )}
              />
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 space-y-0.5 text-white">
          <p className="font-heading text-xl tracking-tight leading-none">
            {formatDateRange(ex.date, ex.endDate)}
          </p>
          {place.name && (
            <p className="text-sm font-medium text-white/90 leading-tight">{place.name}</p>
          )}
          {(city || timeRange) && (
            <p className="text-[11px] text-white/70">
              {[city, timeRange].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2.5 flex-1 min-h-0 overflow-hidden">
        <h3 className="font-heading text-base tracking-tight leading-tight line-clamp-2 text-foreground">
          {ex.title}
        </h3>

        {ex.description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {ex.description}
          </p>
        )}

        <div className="h-px bg-border" />

        {timeRange && (
          <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {timeRange}
          </span>
        )}

        <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <CalendarDays className="w-3 h-3 flex-shrink-0" />
          {formatDateRange(ex.date, ex.endDate)}
        </span>

        {ex.location && (
          <a
            href={exhibitionMapsUrl(ex.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-colors pt-1 group/loc"
          >
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 group-hover/loc:-translate-y-0.5 transition-transform" />
            <span className="underline underline-offset-4 decoration-primary/40 group-hover/loc:decoration-primary">
              {t("home.exhibitions.viewLocation")}
            </span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ExhibitionsStrip({ exhibitions }: { exhibitions: Exhibition[] }) {
  const { t } = useTranslation();
  if (!exhibitions.length) return null;

  return (
    <section className="relative py-10 md:py-16 bg-background border-y border-border/40 overflow-hidden">
      <Container className="relative">
          <SectionTitle title={t("home.exhibitions.title")} subtitle={t("home.exhibitions.subtitle")} />
        <div className="flex items-start gap-5 overflow-x-auto pb-3 no-scrollbar">
          {exhibitions.map((ex, i) => (
            <ExhibitionCard key={ex.id} ex={ex} i={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}


import { useContentStore } from "@/store/contentStore";
import { SectionTitle } from "../common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";
import { ExhibitionsSkeleton, LimitedDropsSkeleton } from "@/components/home/HomeSkeletons";

export function ExhibitionsSection() {
  const { exhibitions, isLoading, fetchContent } = useContentStore();

  useEffect(() => { fetchContent(); }, []);

  if (isLoading && !exhibitions.length) return <ExhibitionsSkeleton />;
  // No exhibitions this week — hide the section entirely.
  if (!exhibitions.length) return null;

  return <ExhibitionsStrip exhibitions={exhibitions} />;
}

export function LimitedDropsSection() {
  const { limitedDrops, isLoading, fetchContent } = useContentStore();

  useEffect(() => { fetchContent(); }, []);

  if (isLoading && !limitedDrops.length) return <LimitedDropsSkeleton />;
  if (!limitedDrops.length) return null;

  return <LimitedDropsStrip drops={limitedDrops} />;
}
