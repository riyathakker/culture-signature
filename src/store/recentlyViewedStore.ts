import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  images: string[];
  category: string;
}

interface RecentlyViewedStore {
  products: RecentProduct[];
  addProduct: (p: RecentProduct) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (p) => {
        const prev = get().products.filter((x) => x.id !== p.id);
        set({ products: [p, ...prev].slice(0, 10) });
      },

      clear: () => set({ products: [] }),
    }),
    { name: "cs_recently_viewed" }
  )
);
