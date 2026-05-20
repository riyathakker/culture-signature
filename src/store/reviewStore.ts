import { create } from "zustand";
import { ReviewService } from "@/services/review";

interface ReviewStore {
  submitReview: (data: { productId: string; orderId: string; rating: number; comment: string }) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>(() => ({
  submitReview: async (data) => {
    await ReviewService.submitReview(data);
  },
}));
