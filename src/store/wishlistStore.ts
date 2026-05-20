import { create } from "zustand";
import { Product } from "@/types";
import { WishlistService } from "@/services/wishlist";

export type WishlistItem = Product;

type WishlistStore = {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await WishlistService.getWishlist();
      set({ items });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const exists = get().items.some((i) => i.id === item.id);
    if (exists) return;

    set((state) => ({ items: [...state.items, item] }));

    try {
      await WishlistService.addItem(item.id);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  },

  removeItem: async (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      await WishlistService.removeItem(id);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  },

  isInWishlist: (id) => get().items.some((item) => item.id === id),

  clearWishlist: () => set({ items: [] }),
}));
