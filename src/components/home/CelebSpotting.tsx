"use client";

import { useState } from "react";

import { SectionTitle } from "@/components/common/SectionTitle";
import { useTranslation } from "@/context/TranslationContext";

const DEFAULT_IMAGES = [
  "/celebs/celeb-1.jpg",
  "/celebs/celeb-2.jpg",
  "/celebs/celeb-3.jpg",
  "/celebs/celeb-4.jpg",
  "/celebs/celeb-5.jpg",
  "/celebs/celeb-6.jpg",
  "/celebs/celeb-7.jpg",
];

export function CelebSpotting() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const marqueeImgs = [...DEFAULT_IMAGES, ...DEFAULT_IMAGES];
  return (
    <>
      <section className="py-20 bg-secondary/50 overflow-hidden border-t border-border/50">
        <SectionTitle
          title={t("home.celebSpotting.title")}
          subtitle={t("home.celebSpotting.subtitle")}
          align="center"
        />

        <div className="relative mt-10 w-full flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-4 px-2 w-max">
            {marqueeImgs.map((src, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(src)}
                className="relative w-64 md:w-80 h-[400px] flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
              >
                <img
                  src={src}
                  alt="Celebrity Spotting"
                  className="
                    w-full 
                    h-full 
                    object-cover 
                    transition-transform 
                    duration-500 
                    ease-out
                    group-hover:scale-110
                  "
                />

                <div
                  className="
                    absolute 
                    inset-0 
                    bg-black/20 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-opacity 
                    duration-300
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="
            fixed 
            inset-0 
            z-[9999] 
            bg-black/90 
            flex 
            items-center 
            justify-center 
            p-4
            cursor-pointer
          "
        >
          <img
            src={selectedImage}
            alt="Fullscreen"
            className="
              max-w-full 
              max-h-full 
              object-contain 
              rounded-md
              animate-in
              fade-in
              zoom-in-95
              duration-300
            "
          />

          <button
            onClick={() => setSelectedImage(null)}
            className="
              absolute 
              top-5 
              right-5 
              text-white 
              text-4xl 
              leading-none
            "
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}