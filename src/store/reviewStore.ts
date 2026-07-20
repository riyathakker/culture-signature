import { create } from "zustand";
import { ReviewService } from "@/services/review";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null } | null;
  product?: { name: string | null } | null;
}

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  currentProductId: string | null;
  fetchReviews: (productId: string) => Promise<void>;
  submitReview: (data: { productId: string; orderId: string; rating: number; comment: string }) => Promise<void>;
  addReview: (review: Review) => void;

  // Home "Voices of Elegance" — latest, highly-rated reviews
  featuredReviews: Review[];
  featuredFetched: number | null;
  fetchFeaturedReviews: (force?: boolean) => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  isLoading: false,
  currentProductId: null,
  featuredReviews: [],
  featuredFetched: null,

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

  fetchFeaturedReviews: async (force = false) => {
    const { featuredFetched } = get();
    if (!force && featuredFetched && Date.now() - featuredFetched < 300000) return;
    try {
      const res = await fetch("/api/reviews/featured");
      if (!res.ok) throw new Error("Failed to fetch featured reviews");
      const featuredReviews = await res.json();
      set({ featuredReviews, featuredFetched: Date.now() });
    } catch {
      // keep any existing/static fallback; don't clobber on failure
    }
  },
}));
