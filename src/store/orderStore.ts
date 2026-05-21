import { create } from 'zustand';
import { toast } from 'sonner';
import { Order } from '@/types';
import { OrderService } from '@/services/order';

interface OrderState {
  orders: Order[];
  totalOrders: number;
  isLoading: boolean;
  lastFetched: number | null;
  setOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  updateOrder: (order: Order) => void;
  fetchOrders: (force?: boolean, params?: { page?: number; limit?: number; query?: string; status?: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  totalOrders: 0,
  isLoading: false,
  lastFetched: null,
  setOrders: (orders) => set({ orders, totalOrders: orders.length, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  updateOrder: (order) => set((state) => ({
    orders: state.orders.map((o) => (o.id === order.id ? order : o)),
  })),
  fetchOrders: async (force = false, params) => {
    const state = get();
    // Cache for 5 minutes unless forced (skip cache if pagination params are active)
    if (!force && !params && state.orders.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const data = await OrderService.getAll(params);
      
      if (data && typeof data === "object" && "items" in data) {
        set({
          orders: data.items,
          totalOrders: data.total,
          lastFetched: Date.now(),
        });
      } else {
        const list = Array.isArray(data) ? data : [];
        set({
          orders: list,
          totalOrders: list.length,
          lastFetched: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (orderId, status) => {
    try {
      const updatedOrder = await OrderService.updateStatus(orderId, status);
      get().updateOrder(updatedOrder);
      toast.success(`Order ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Failed to update order status");
    }
  }
}));
