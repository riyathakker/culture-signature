import { create } from "zustand";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
};

type WishlistStore = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id);
      if (exists) return state;
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  isInWishlist: (id) => get().items.some((item) => item.id === id),

  clearWishlist: () => set({ items: [] }),
}));
