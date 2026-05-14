import { create } from "zustand";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  description: string;
};

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
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const items = await response.json();
        set({ items });
      }
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
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id }),
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  },

  removeItem: async (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  },

  isInWishlist: (id) => get().items.some((item) => item.id === id),

  clearWishlist: () => set({ items: [] }),
}));
