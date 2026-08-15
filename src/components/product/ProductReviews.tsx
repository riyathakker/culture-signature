"use client";

import { useEffect } from "react";
import { Star, Loader2, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { useParams } from "next/navigation";
import { useReviewStore } from "@/store/reviewStore";
import { useOrderStore } from "@/store/orderStore";
import { useSession } from "next-auth/react";
import { ReviewModal } from "@/components/account/ReviewModal";
import { useTranslation } from "@/context/TranslationContext";

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

interface ProductReviewsProps {
  productName?: string;
}

export function ProductReviews({ productName = "this product" }: ProductReviewsProps) {
  const { id: productId } = useParams();
  const { reviews, isLoading, fetchReviews } = useReviewStore();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { myOrders, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    if (productId) fetchReviews(productId as string);
  }, [productId]);

  useEffect(() => {
    if (session?.user) fetchMyOrders();
  }, [session?.user]);

  const eligibleOrder = myOrders.find((order) =>
    order.items?.some(
      (item: any) => item.productId === productId || item.product?.id === productId
    )
  );

  const alreadyReviewed = reviews.some(
    (r) => r.user?.name && session?.user?.name && r.user.name === session.user.name
  );

  const handleReviewSuccess = () => fetchReviews(productId as string);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => Math.round(rev.rating) === r).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((rev) => Math.round(rev.rating) === r).length / reviews.length) * 100
        : 0,
  }));

  if (isLoading)
    return (
      <div className="py-10 border-t flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
      </div>
    );

  return (
    <div className="py-10 border-t">
      <h3 className="font-heading text-3xl mb-8">{t("shop.product.details.reviews.title")}</h3>

      {reviews.length === 0 ? (
        /* ── Empty state ── */
        <div className="py-16 flex flex-col items-center gap-6 border border-dashed border-muted-foreground/20 rounded-sm text-center px-8">
          <div className="w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <PenLine className="w-6 h-6 text-primary/40" />
          </div>
          <div className="space-y-2">
            <p className="font-heading text-2xl">{t("shop.product.details.reviews.beFirst")}</p>
            <p className="muted-italic text-muted-foreground max-w-xs">
              {t("shop.product.details.reviews.beFirstDesc")}
            </p>
          </div>
          {eligibleOrder ? (
            <ReviewModal
              productId={productId as string}
              productName={productName}
              orderId={eligibleOrder.id}
              onSuccess={handleReviewSuccess}
            />
          ) : session?.user ? (
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("shop.product.details.reviews.purchaseToReview")}
            </p>
          ) : (
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("shop.product.details.reviews.signInToReview")}
            </p>
          )}
        </div>
      ) : (
        /* ── Reviews present ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Rating Summary */}
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <span className="text-6xl font-heading">{avgRating.toFixed(1)}</span>
              <div className="space-y-1">
                <StarDisplay rating={avgRating} size="md" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  {t("shop.product.details.reviews.basedOn", { count: reviews.length })}{" "}
                  {reviews.length === 1
                    ? t("shop.product.details.reviews.reviewSingular")
                    : t("shop.product.details.reviews.reviewPlural")}
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

            {/* Write review CTA in sidebar when reviews exist */}
            {eligibleOrder && !alreadyReviewed && (
              <div className="pt-4 border-t border-muted-foreground/10">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  {t("shop.product.details.reviews.shareExperience")}
                </p>
                <ReviewModal
                  productId={productId as string}
                  productName={productName}
                  orderId={eligibleOrder.id}
                  onSuccess={handleReviewSuccess}
                />
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-12">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <StarDisplay rating={review.rating} />
                    <h4 className="font-heading text-xl">{review.user?.name || t("shop.product.details.reviews.customer")}</h4>
                  </div>
                  <span className="text-spaced-bold text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="font-serif italic text-muted-foreground text-lg leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {review.user?.name?.[0] || "C"}
                  </div>
                  <span className="text-spaced-bold">{review.user?.name || t("shop.product.details.reviews.verifiedBuyer")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
