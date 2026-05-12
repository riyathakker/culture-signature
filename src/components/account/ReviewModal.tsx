"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  productId: string;
  productName: string;
  orderId: string;
  onSuccess?: () => void;
}

export function ReviewModal({ productId, productName, orderId, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="text-[10px] uppercase tracking-widest gap-2">
          <Star className="w-3 h-3" /> Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-none">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl tracking-tight">Write a Review</DialogTitle>
          <p className="text-muted-foreground font-serif italic text-sm">
            Sharing your experience with the {productName}.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-all duration-300 transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hover || rating) >= star
                        ? "text-primary fill-primary"
                        : "text-muted border-none"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60">Your Thoughts</label>
            <Textarea
              placeholder="What did you love about this piece?"
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
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
