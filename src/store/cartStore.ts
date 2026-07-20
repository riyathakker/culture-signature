import { create } from "zustand";
import { toast } from "sonner";
import { Discount } from "@/types";
import { CartService } from "@/services/cart";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  color?: string;
  colorHex?: string;
};

/** Stable per-line identity: a product may appear once per selected color. */
export const cartLineKey = (id: string, color?: string) => `${id}::${color || ""}`;
const sameLine = (a: CartItem, id: string, color?: string) =>
  a.id === id && (a.color || "") === (color || "");

type CartStore = {
  items: CartItem[];
  isLoading: boolean;
  appliedPromo: Discount | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  fetchCart: (force?: boolean) => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string, color?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setAppliedPromo: (promo: Discount | null) => void;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  appliedPromo: null,
  isAuthenticated: false,

  setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

  fetchCart: async (force = false) => {
    if (!get().isAuthenticated && !force) return;
    set({ isLoading: true });
    try {
      const items = await CartService.getCart();
      set({ items });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const state = get();
    const existingItem = state.items.find((i) => sameLine(i, item.id, item.color));
    const newQuantity = (existingItem?.quantity || 0) + item.quantity;

    // Client-side stock check
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} ${item.stock === 1 ? "item" : "items"} available in stock.`);
      return;
    }

    set((state) => {
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            sameLine(i, item.id, item.color) ? { ...i, quantity: newQuantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });

    if (!get().isAuthenticated) {
      return;
    }

    try {
      await CartService.addItem(item.id, item.quantity, item.color);
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      toast.error(error.message || "Failed to add to cart");
      get().fetchCart(); // Re-sync with server
    }
  },

  removeItem: async (id, color) => {
    set((state) => ({
      items: state.items.filter((item) => !sameLine(item, id, color)),
    }));

    if (!get().isAuthenticated) return;

    try {
      await CartService.removeItem(id, color);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },

  updateQuantity: async (id, quantity, color) => {
    if (quantity <= 0) {
      get().removeItem(id, color);
      return;
    }

    const state = get();
    const item = state.items.find((i) => sameLine(i, id, color));

    if (item && quantity > item.stock) {
      toast.error(`Only ${item.stock} ${item.stock === 1 ? "item" : "items"} available in stock.`);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        sameLine(item, id, color) ? { ...item, quantity } : item
      ),
    }));

    if (!get().isAuthenticated) return;

    try {
      await CartService.updateQuantity(id, quantity, color);
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      toast.error(error.message || "Failed to update quantity");
      get().fetchCart(); // Re-sync
    }
  },

  clearCart: async () => {
    set({ items: [], appliedPromo: null });
    if (!get().isAuthenticated) return;

    try {
      await CartService.clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  },

  setAppliedPromo: (promo) => set({ appliedPromo: promo }),

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const { items, appliedPromo } = get();
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (!appliedPromo) return 0;

    if (appliedPromo.type === "PERCENTAGE") {
      return (subtotal * appliedPromo.value) / 100;
    } else {
      return Math.min(appliedPromo.value, subtotal);
    }
  },
}));