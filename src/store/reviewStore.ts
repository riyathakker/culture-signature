import { create } from "zustand";
import { ReviewService } from "@/services/review";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null } | null;
}

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  currentProductId: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  submitReview: (data: { productId: string; orderId: string; rating: number; comment: string }) => Promise<void>;
  addReview: (review: Review) => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  isLoading: false,
  currentProductId: null,

  fetchReviews: async (productId) => {
    if (get().currentProductId === productId && get().reviews.length > 0) return;
    set({ isLoading: true, currentProductId: productId });
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const reviews = await res.json();
      set({ reviews, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  submitReview: async (data) => {
    await ReviewService.submitReview(data);
    // refetch reviews for this product
    set({ currentProductId: null });
    await get().fetchReviews(data.productId);
  },

  addReview: (review) => set((s) => ({ reviews: [review, ...s.reviews] })),
}));
