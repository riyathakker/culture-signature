"use client";

import { useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useParams } from "next/navigation";
import { useReviewStore } from "@/store/reviewStore";

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3 h-3" : "w-5 h-5";
  return (
    <div className="flex text-primary">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half = !filled && rating >= i - 0.5;
        return (
          <span key={i} className="relative">
            <Star className={cn(cls, "opacity-20")} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star className={cn(cls, "fill-primary text-primary")} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ProductReviews() {
  const { id: productId } = useParams();
  const { reviews, isLoading, fetchReviews } = useReviewStore();

  useEffect(() => {
    if (productId) fetchReviews(productId as string);
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 5;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => Math.round(rev.rating) === r).length,
    percentage: reviews.length > 0
      ? (reviews.filter((rev) => Math.round(rev.rating) === r).length / reviews.length) * 100
      : 0,
  }));

  if (isLoading) return (
    <div className="py-20 border-t flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
    </div>
  );

  return (
    <div className="py-20 border-t">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Rating Summary */}
        <div className="space-y-8">
          <h3 className="font-heading text-3xl">Client Experiences</h3>
          <div className="flex items-center gap-6">
            <span className="text-6xl font-heading">{avgRating.toFixed(1)}</span>
            <div className="space-y-1">
              <StarDisplay rating={avgRating} size="md" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                Based on {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <span className="text-xs font-bold w-3">{rating}</span>
                <Progress value={percentage} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-8">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-12">
          {reviews.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed rounded-sm">
              <p className="muted-italic">No reviews yet. Be the first to share your experience from your Order History.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <StarDisplay rating={review.rating} />
                    <h4 className="font-heading text-xl">Artesian Choice</h4>
                  </div>
                  <span className="text-spaced-bold text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="font-serif italic text-muted-foreground text-lg leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {review.user?.name?.[0] || "C"}
                  </div>
                  <span className="text-spaced-bold">{review.user?.name || "Verified Client"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
