"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** Pass multiple images to enable gallery navigation inside the lightbox */
  images?: string[];
  /** Which index in `images` to open at (defaults to index of `src` in images, or 0) */
  initialIndex?: number;
  children?: React.ReactNode;
}

export function ImageLightbox({
  src,
  alt = "",
  className,
  imgClassName,
  images,
  initialIndex,
  children,
}: ImageLightboxProps) {
  const { t } = useTranslation();
  const gallery = images && images.length > 0 ? images : [src];
  const startIndex = initialIndex ?? gallery.indexOf(src) ?? 0;

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(startIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const prev = useCallback(
    () => setCurrent((i) => (i > 0 ? i - 1 : gallery.length - 1)),
    [gallery.length]
  );
  const next = useCallback(
    () => setCurrent((i) => (i < gallery.length - 1 ? i + 1 : 0)),
    [gallery.length]
  );

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(initialIndex ?? gallery.indexOf(src) ?? 0);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, prev, next]);

  if (!src && !children) {
    return <div className={className} />;
  }

  const trigger = (
    <div
      role="button"
      tabIndex={0}
      aria-label={t("common.viewFullscreen", { alt })}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen(e as any)}
      className={cn("relative group cursor-zoom-in", className)}
    >
      {children ?? (
        <img src={src} alt={alt} className={cn("w-full h-full object-cover", imgClassName)} />
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );

  if (!mounted) return trigger;

  return (
    <>
      {trigger}

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            {gallery.length > 1 && (
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                {current + 1} / {gallery.length}
              </span>
            )}

            {/* Main image */}
            <img
              src={gallery[current]}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Prev / Next */}
            {gallery.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label={t("common.previous")}
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label={t("common.next")}
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-[90vw] overflow-x-auto no-scrollbar">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                    className={cn(
                      "w-14 h-14 rounded-sm overflow-hidden border-2 shrink-0 transition-all",
                      i === current ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
