"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useReviewStore } from "@/store/reviewStore";
import { useTranslation } from "@/context/TranslationContext";

interface ReviewModalProps {
  productId: string;
  productName: string;
  orderId: string;
  onSuccess?: () => void;
}

// Half-star picker: increments of 0.5 from 0.5 to 5.0
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fullFilled = display >= star;
        const halfFilled = !fullFilled && display >= star - 0.5;
        return (
          <span key={star} className="relative w-9 h-9 cursor-pointer">
            {/* left half — sets n-0.5 */}
            <span
              className="absolute inset-0 w-1/2 z-10"
              onMouseEnter={() => setHovered(star - 0.5)}
              onClick={() => onChange(star - 0.5)}
            />
            {/* right half — sets n */}
            <span
              className="absolute inset-0 left-1/2 w-1/2 z-10"
              onMouseEnter={() => setHovered(star)}
              onClick={() => onChange(star)}
            />
            {/* empty star base */}
            <Star className="w-8 h-8 text-muted/60 absolute inset-0.5" />
            {/* filled overlay */}
            {(fullFilled || halfFilled) && (
              <span
                className="absolute inset-0.5 overflow-hidden"
                style={{ width: fullFilled ? "100%" : "50%" }}
              >
                <Star className="w-8 h-8 fill-primary text-primary" />
              </span>
            )}
          </span>
        );
      })}
      <span className="ml-2 text-sm font-bold text-primary tabular-nums">
        {display.toFixed(1)}
      </span>
    </div>
  );
}

export function ReviewModal({ productId, productName, orderId, onSuccess }: ReviewModalProps) {
  const { submitReview } = useReviewStore();
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitReview({ productId, orderId, rating, comment });
      toast.success(t("account.review.success"));
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t("account.review.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="text-spaced-bold gap-2">
          <Star className="w-3 h-3" /> {t("account.review.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">{t("account.review.title")}</DialogTitle>
          <p className="muted-italic text-sm">{t("account.review.subtitle", { name: productName })}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60">{t("account.review.rating")}</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60">{t("account.review.thoughts")}</label>
            <Textarea
              placeholder={t("account.review.placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] bg-secondary/20 border-none focus:ring-1 focus:ring-primary font-serif italic"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-6 uppercase tracking-[0.2em] text-xs h-auto"
          >
            {isSubmitting ? t("account.review.submitting") : t("account.review.submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
