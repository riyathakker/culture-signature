import { create } from 'zustand';
import { toast } from 'sonner';
import { Discount } from '@/types';
import { DiscountService } from '@/services/discount';

interface DiscountState {
  discounts: Discount[];
  isLoading: boolean;
  lastFetched: number | null;
  setDiscounts: (discounts: Discount[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchDiscounts: (force?: boolean) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
  createDiscount: (data: any) => Promise<Discount>;
  updateDiscountById: (id: string, data: any) => Promise<Discount>;
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
      const data = await DiscountService.getAll();
      set({ discounts: Array.isArray(data) ? data : [], lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteDiscount: async (id: string) => {
    try {
      await DiscountService.delete(id);

      set((state) => ({
        discounts: state.discounts.filter((d) => d.id !== id),
      }));
      toast.success("Discount deleted successfully.");
    } catch (error) {
      toast.error("Could not delete the discount.");
    }
  },

  createDiscount: async (data: any): Promise<Discount> => {
    const discount = await DiscountService.create(data);
    set((state) => ({ discounts: [...state.discounts, discount] }));
    return discount;
  },

  updateDiscountById: async (id: string, data: any): Promise<Discount> => {
    const discount = await DiscountService.update(id, data);
    set((state) => ({
      discounts: state.discounts.map((d) => (d.id === id ? discount : d)),
    }));
    return discount;
  },
}));
