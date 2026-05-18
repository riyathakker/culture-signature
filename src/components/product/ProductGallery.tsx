"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  console.log("hereee are my gallery imagess", images)
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 lg:w-24">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "relative aspect-square w-16 md:w-full border-2 transition-all duration-300 rounded-sm overflow-hidden flex-shrink-0",
              activeIndex === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img src={img} alt="" />
          </button>
        ))}
      </div>

      <div className="flex-1 relative aspect-square bg-secondary/30 rounded-sm overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            <img src={images[activeIndex]} alt="" />
            
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" className="bg-background/80 border-none backdrop-blur-sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
