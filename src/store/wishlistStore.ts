import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/types";
import { WishlistService } from "@/services/wishlist";

export type WishlistItem = Product;

type WishlistStore = {
  items: WishlistItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  fetchWishlist: (force?: boolean) => Promise<void>;
  mergeGuestWishlistOnLogin: () => Promise<void>;
  clearLocalWishlist: () => void;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(persist((set, get) => ({
  items: [],
  isLoading: false,
  isAuthenticated: false,

  setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

  // Called on the guest→authenticated transition: push the locally persisted
  // guest items to the server (upsert, so duplicates are safe), then pull the
  // authoritative merged wishlist back.
  mergeGuestWishlistOnLogin: async () => {
    const guestItems = get().items;
    for (const it of guestItems) {
      try {
        await WishlistService.addItem(it.id);
      } catch (error) {
        console.error("Wishlist merge skipped an item:", error);
      }
    }
    await get().fetchWishlist(true);
  },

  // Local-only clear (used on logout) — never touches the server wishlist.
  clearLocalWishlist: () => set({ items: [] }),

  fetchWishlist: async (force = false) => {
    if (!get().isAuthenticated && !force) return;
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

    // Optimistic add; roll back if the server rejects it.
    set((state) => ({ items: [...state.items, item] }));

    if (!get().isAuthenticated) return;

    try {
      await WishlistService.addItem(item.id);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      set((state) => ({ items: state.items.filter((i) => i.id !== item.id) }));
      toast.error("Couldn't add to wishlist. Please try again.");
    }
  },

  removeItem: async (id) => {
    const removed = get().items.find((i) => i.id === id);
    if (!removed) return;

    // Optimistic remove; restore its original position on failure.
    const prevItems = get().items;
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));

    if (!get().isAuthenticated) return;

    try {
      await WishlistService.removeItem(id);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      set({ items: prevItems });
      toast.error("Couldn't update wishlist. Please try again.");
    }
  },

  isInWishlist: (id) => get().items.some((item) => item.id === id),

  clearWishlist: () => set({ items: [] }),
}), {
  name: "cs-wishlist",
  storage: createJSONStorage(() => localStorage),
  // Persist only the wishlist contents; auth/loading are runtime-only.
  partialize: (state) => ({ items: state.items }),
}));
