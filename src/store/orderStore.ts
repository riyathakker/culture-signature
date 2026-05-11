import { create } from 'zustand';

interface OrderState {
  orders: any[];
  isLoading: boolean;
  lastFetched: number | null;
  setOrders: (orders: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  updateOrder: (order: any) => void;
  fetchOrders: (query?: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  lastFetched: null,
  setOrders: (orders) => set({ orders, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  updateOrder: (order) => set((state) => ({
    orders: state.orders.map((o) => (o.id === order.id ? order : o)),
  })),
  fetchOrders: async () => {
    const state = get();
    // Cache for 5 minutes
    if (state.orders.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      set({ orders: data, lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
