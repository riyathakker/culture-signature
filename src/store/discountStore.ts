import { create } from 'zustand';
import { toast } from 'sonner';
import { Discount } from '@/types';

interface DiscountState {
  discounts: Discount[];
  isLoading: boolean;
  lastFetched: number | null;
  setDiscounts: (discounts: Discount[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchDiscounts: (force?: boolean) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
}

export const useDiscountStore = create<DiscountState>((set, get) => ({
  discounts: [],
  isLoading: false,
  lastFetched: null,
  setDiscounts: (discounts) => set({ discounts, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchDiscounts: async (force = false) => {
    const state = get();
    // Cache for 5 minutes unless forced
    if (!force && state.discounts.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/admin/discounts");
      const data = await response.json();
      set({ discounts: Array.isArray(data) ? data : [], lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteDiscount: async (id: string) => {
    try {
      const response = await fetch(`/api/admin/discounts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete discount");

      set((state) => ({
        discounts: state.discounts.filter((d) => d.id !== id),
      }));
      toast.success("Discount deleted successfully.");
    } catch (error) {
      toast.error("Could not delete the discount.");
    }
  },
}));
