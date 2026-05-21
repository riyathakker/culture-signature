"use client";

import { Categories } from "@/components/home/Categories";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CelebSpotting } from "@/components/home/CelebSpotting";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ContentSection } from "@/components/home/ContentSection";
import { Collections } from "@/components/home/Collections";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <HeroSection />
      <ContentSection />
      <Categories />
      <FeaturedProducts />
      <Collections />
      <NewArrivals />
      <CelebSpotting />
      <Testimonials />
      <FAQ />
    </div>
  );
}
