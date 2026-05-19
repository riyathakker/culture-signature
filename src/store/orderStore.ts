import { create } from 'zustand';
import { toast } from 'sonner';
import { Order } from '@/types';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  lastFetched: number | null;
  setOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  updateOrder: (order: Order) => void;
  fetchOrders: (force?: boolean) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
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
  fetchOrders: async (force = false) => {
    const state = get();
    // Cache for 5 minutes unless forced
    if (!force && state.orders.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
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
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedOrder = await response.json();
      get().updateOrder(updatedOrder);
      toast.success(`Order ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Failed to update order status");
    }
  }
}));
