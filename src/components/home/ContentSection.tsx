"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Clock, Camera } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/common/ProductCard";
import { Product, Exhibition } from "@/types";
import { cn } from "@/lib/utils";

function mapsUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

// ─── Limited drops ────────────────────────────────────────────────────────────

function LimitedDropsStrip({ drops }: { drops: Product[] }) {
  if (!drops.length) return null;

  return (
    <section className="py-14 border-t border-border/30">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold mb-1">Limited Pieces</p>
            <h2 className="font-heading text-2xl md:text-3xl tracking-tight">Only a Few Left</h2>
          </div>
          <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/50 pb-1 hidden sm:inline">
            {drops.length} {drops.length === 1 ? "piece" : "pieces"} available
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {drops.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative min-w-[220px] max-w-[220px] flex-shrink-0"
            >
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="text-[8px] uppercase tracking-widest font-bold bg-primary text-primary-foreground px-2 py-1">
                    {product.stock} left
                  </span>
                </div>
              )}
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Exhibitions ──────────────────────────────────────────────────────────────

function ExhibitionsStrip({ exhibitions }: { exhibitions: Exhibition[] }) {
  if (!exhibitions.length) return null;

  return (
    <section className="relative py-10 md:py-16 bg-primary text-primary-foreground overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,currentColor 39px,currentColor 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,currentColor 39px,currentColor 40px)",
        }}
      />

      <Container className="relative">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary-foreground/40 font-bold mb-2">
                Where to Find Us
              </p>
              <h2 className="font-heading text-3xl md:text-4xl tracking-tight">Exhibitions & Shoots</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-primary-foreground/30 pb-1 hidden sm:inline">
              {exhibitions.length} {exhibitions.length === 1 ? "event" : "events"}
            </span>
          </div>
          <motion.div
            className="h-px bg-primary-foreground/20 mt-4"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          />
        </motion.div>

        <div className="flex gap-5 overflow-x-auto pb-3 no-scrollbar">
          {exhibitions.map((ex, i) => {
            const isFeatured = i === 0;
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  "flex-shrink-0 border border-primary-foreground/15 bg-primary-foreground/5 overflow-hidden group relative",
                  isFeatured ? "w-80" : "w-64"
                )}
              >
                {/* Image area */}
                <div className={cn("overflow-hidden relative", isFeatured ? "h-56" : "h-40")}>
                  {ex.images[0] ? (
                    <>
                      <img
                        src={ex.images[0]}
                        alt={ex.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-primary-foreground/5 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary-foreground/15" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      "flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold px-2 py-1 border backdrop-blur-sm",
                      ex.status === "ONGOING"  ? "border-green-300/50 text-green-200 bg-green-950/60" :
                      ex.status === "UPCOMING" ? "border-blue-300/50 text-blue-200 bg-blue-950/60" :
                                                 "border-white/15 text-white/40 bg-black/30"
                    )}>
                      {ex.status === "ONGOING" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      )}
                      {ex.status}
                    </span>
                  </div>

                  {/* Title overlaid on image for featured card */}
                  {isFeatured && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-lg tracking-tight leading-tight">{ex.title}</h3>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  {!isFeatured && (
                    <h3 className="font-heading text-base tracking-tight leading-tight">{ex.title}</h3>
                  )}

                  {isFeatured && ex.description && (
                    <p className="text-[11px] text-primary-foreground/50 leading-relaxed line-clamp-2">
                      {ex.description}
                    </p>
                  )}

                  <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">
                    {format(new Date(ex.date), "dd MMM yyyy")}
                    {ex.endDate && ` — ${format(new Date(ex.endDate), "dd MMM")}`}
                  </p>

                  {(ex.startTime || ex.endTime) && (
                    <p className="text-[10px] text-primary-foreground/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ex.startTime}{ex.endTime && ` — ${ex.endTime}`}
                    </p>
                  )}

                  {ex.location && (
                    <a
                      href={mapsUrl(ex.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[10px] text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                    >
                      <MapPin className="w-3 h-3 flex-shrink-0 group-hover:translate-y-[-2px] transition-transform duration-300" />
                      <span className="truncate underline-offset-2 hover:underline">{ex.location}</span>
                    </a>
                  )}
                </div>

                {/* Animated bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-primary-foreground/30"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.13 + 0.5, ease: "easeOut" }}
                />
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}


import { useContentStore } from "@/store/contentStore";

export function ContentSection() {
  const { limitedDrops, exhibitions, fetchContent } = useContentStore();

  useEffect(() => { fetchContent(); }, []);

  if (!limitedDrops.length && !exhibitions.length) return null;

  return (
    <>
      <LimitedDropsStrip drops={limitedDrops} />
      <ExhibitionsStrip exhibitions={exhibitions} />
    </>
  );
}
