"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <HomePageContainer label={[{ label: "Your Wishlist" }]} heading="Wishlist" description="A curated list of your most desired artisanal pieces.">
      {items.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center relative">
            <Heart className="w-10 h-10 text-primary/30" />
            <div className="absolute inset-0 bg-luxury-gradient opacity-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-heading">Your collection is empty</h2>
            <p className="muted-italic max-w-md mx-auto">
              Discover our range of handcrafted masterpieces and save your favorites here.
            </p>
          </div>
          <Link href={ROUTES.COLLECTIONS}>
            <Button className="py-7 px-10 uppercase tracking-[0.2em] text-xs h-auto gap-2">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-700">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} variant="wishlist" />
          ))}
        </div>
      )}
    </HomePageContainer>
  );
}
