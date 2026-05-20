"use client";

import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function ProductReviews() {
  const { id: productId } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: reviews.filter(rev => rev.rating === r).length,
    percentage: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0
  }));

  if (loading) return (
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
            <span className="text-6xl font-heading">{avgRating}</span>
            <div className="space-y-1">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-5 h-5", i < Math.floor(Number(avgRating)) ? "fill-current" : "opacity-30")} />
                ))}
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Based on {reviews.length} Reviews</p>
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
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-current" : "opacity-30")} />
                      ))}
                    </div>
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
