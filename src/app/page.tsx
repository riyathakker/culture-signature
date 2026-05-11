"use client";

import { Categories } from "@/components/home/Categories";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CelebSpotting } from "@/components/home/CelebSpotting";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NewArrivals } from "@/components/home/NewArrivals";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <NewArrivals />
      <CelebSpotting />
      <Testimonials />
      <FAQ />
    </div>
  );
}
