import { create } from 'zustand';
import { toast } from 'sonner';
import { Order } from '@/types';
import { OrderService } from '@/services/order';

interface OrderState {
  // Admin orders
  orders: Order[];
  totalOrders: number;
  isLoading: boolean;
  lastFetched: number | null;
  setOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  updateOrder: (order: Order) => void;
  fetchOrders: (force?: boolean, params?: { page?: number; limit?: number; query?: string; status?: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;

  // Customer orders (own orders, SSE-backed)
  myOrders: Order[];
  myOrdersLoading: boolean;
  fetchMyOrders: () => Promise<void>;
  applyOrderUpdate: (updated: Order[]) => void;
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
  },

  // Customer
  myOrders: [],
  myOrdersLoading: false,

  fetchMyOrders: async () => {
    set({ myOrdersLoading: true });
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed");
      const orders = await res.json();
      set({ myOrders: orders, myOrdersLoading: false });
    } catch {
      set({ myOrdersLoading: false });
    }
  },

  applyOrderUpdate: (updated) => {
    set((state) => {
      const map = new Map(state.myOrders.map((o) => [o.id, o]));
      updated.forEach((o) => map.set(o.id, o));
      return { myOrders: Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
    });
  },
}));
