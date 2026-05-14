import { create } from "zustand";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
};

type CartStore = {
  items: CartItem[];
  isLoading: boolean;
  appliedPromo: any | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  setAppliedPromo: (promo: any | null) => void;
  getTotalPrice: () => number;
  getDiscountAmount: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  appliedPromo: null,
  isAuthenticated: false,

  setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const items = await response.json();
        set({ items });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const state = get();
    const existingItem = state.items.find((i) => i.id === item.id);
    const newQuantity = (existingItem?.quantity || 0) + item.quantity;

    // Client-side stock check
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock.`);
      return;
    }

    set((state) => {
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });

    if (!get().isAuthenticated) {
      toast.success(`${item.name} added to cart`);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to add to cart");
        get().fetchCart(); // Re-sync with server
      } else {
        toast.success(`${item.name} added to cart`);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  },

  removeItem: async (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    if (!get().isAuthenticated) return;

    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },

  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }

    const state = get();
    const item = state.items.find(i => i.id === id);
    
    if (item && quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock.`);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));

    if (!get().isAuthenticated) return;

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to update quantity");
        get().fetchCart(); // Re-sync
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  },

  clearCart: async () => {
    set({ items: [], appliedPromo: null });
    if (!get().isAuthenticated) return;

    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
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