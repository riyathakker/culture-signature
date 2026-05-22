"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (session?.user) fetchWishlist();
  }, [session?.user]);

  return (
    <HomePageContainer label={[{ label: "Your Wishlist" }]} heading="Wishlist" description="A curated list of your most desired artisanal pieces.">
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your collection is empty"
          description="Discover our range of handcrafted masterpieces and save your favorites here."
          action={{ label: "Explore Collection", href: ROUTES.COLLECTIONS }}
        />
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
