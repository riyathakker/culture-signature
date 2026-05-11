"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { en } from "@/locales/en";

const celebImages = [
  "https://picsum.photos/400/500?random=1",
  "https://picsum.photos/400/500?random=2",
  "https://picsum.photos/400/500?random=3",
  "https://picsum.photos/400/500?random=4",
  "https://picsum.photos/400/500?random=5",
  "https://picsum.photos/400/500?random=6",
  "https://picsum.photos/400/500?random=7",
];

export function CelebSpotting() {
  return (
    <section className="py-16 bg-background overflow-hidden border-t border-muted-foreground/10">
      <div className="container mx-auto px-4">
        <SectionTitle title={en.home.celebSpotting.title} subtitle={en.home.celebSpotting.subtitle} align="center" />
      </div>
      
      <div className="relative mt-10 w-full flex overflow-x-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-4 px-2 w-max">
          {[...celebImages, ...celebImages].map((src, idx) => (
            <div 
              key={idx} 
              className="relative w-64 md:w-80 h-[400px] flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
            >
              <img 
                src={src}
                alt="Celebrity Spotting"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white font-heading text-xl opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  @culturesignature
                </span> 
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
