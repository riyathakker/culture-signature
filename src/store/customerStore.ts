import { create } from 'zustand';
import { User } from '@/types';
import { CustomerService } from '@/services/customer';

interface CustomerState {
  customers: User[];
  totalCustomers: number;
  isLoading: boolean;
  lastFetched: number | null;
  setCustomers: (customers: User[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCustomers: (params?: { page?: number; limit?: number; query?: string; role?: string }) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  totalCustomers: 0,
  isLoading: false,
  lastFetched: null,
  setCustomers: (customers) => set({ customers, totalCustomers: customers.length, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchCustomers: async (params) => {
    const state = get();
    if (!params && state.customers.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 600000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const data = await CustomerService.getAll(params);
      
      if (data && typeof data === "object" && "items" in data) {
        set({
          customers: data.items,
          totalCustomers: data.total,
          lastFetched: Date.now(),
        });
      } else {
        const list = Array.isArray(data) ? data : [];
        set({
          customers: list,
          totalCustomers: list.length,
          lastFetched: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
