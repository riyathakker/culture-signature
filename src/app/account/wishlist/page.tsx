"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AccountWishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (status === "unauthenticated") { router.push(ROUTES.HOME); return; }
    if (status === "authenticated") fetchWishlist();
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-heading">My Wishlist</h2>
        <p className="muted-italic pwa-hide">Pieces you've curated for your future collection.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Pieces you've curated for your future collection will appear here."
          action={{ label: "Explore Collection", href: ROUTES.COLLECTIONS }}
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} variant="wishlist" />
          ))}
        </div>
      )}
    </div>
  );
}
