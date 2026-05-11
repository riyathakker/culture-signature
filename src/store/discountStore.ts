import { create } from 'zustand';

interface DiscountState {
  discounts: any[];
  isLoading: boolean;
  lastFetched: number | null;
  setDiscounts: (discounts: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchDiscounts: () => Promise<void>;
}

// Initial mock data as per current UI
const MOCK_DISCOUNTS = [
  { id: 1, code: "WELCOME20", type: "Percentage", value: "20%", usage: "145/500", status: "Active", expiry: "Jun 30, 2026" },
  { id: 2, code: "SOLSTICE15", type: "Percentage", value: "15%", usage: "82/200", status: "Active", expiry: "May 24, 2026" },
  { id: 3, code: "DIAMOND50", type: "Fixed Amount", value: "₹50,000", usage: "12/50", status: "Scheduled", expiry: "Dec 31, 2026" },
  { id: 4, code: "RETRO10", type: "Percentage", value: "10%", usage: "210/210", status: "Expired", expiry: "Apr 15, 2026" },
];

export const useDiscountStore = create<DiscountState>((set, get) => ({
  discounts: [],
  isLoading: false,
  lastFetched: null,
  setDiscounts: (discounts) => set({ discounts, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchDiscounts: async () => {
    const state = get();
    // Cache for 5 minutes
    if (state.discounts.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/admin/discounts");
      const data = await response.json();
      set({ discounts: data, lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
