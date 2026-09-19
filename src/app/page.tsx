"use client";

import { Categories } from "@/components/home/Categories";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CelebSpotting } from "@/components/home/CelebSpotting";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ExhibitionsSection, LimitedDropsSection } from "@/components/home/ContentSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PWAHomeHeader } from "@/components/pwa/PWAHomeHeader";
import { NewArrivals } from "@/components/home/NewArrivals";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen pwa-page-home">
      <PWAHomeHeader />
      <HeroSection />
      <TrustStrip />
      <Categories />
      <LimitedDropsSection />
      <NewArrivals />
      <FeaturedProducts />
      
      <CelebSpotting />
      <Testimonials />

      <ExhibitionsSection />
      <FAQ />
    </div>
  );
}
