"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { NoImage } from "@/components/common/NoImage";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex-1 relative aspect-square rounded-sm overflow-hidden">
        <NoImage />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 max-w-[500px] max-h-[450px]">
      {/* Main image */}
      <div className="flex-1 relative aspect-square bg-secondary/30 rounded-sm overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ImageLightbox
              src={images[activeIndex]}
              alt=""
              images={images}
              initialIndex={activeIndex}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {
          images.length > 1 &&
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="pointer-events-auto p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="pointer-events-auto p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        }

      </div>
    </div>
  );
}
