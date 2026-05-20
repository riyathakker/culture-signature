import { create } from 'zustand';
import { User } from '@/types';
import { CustomerService } from '@/services/customer';

interface CustomerState {
  customers: User[];
  isLoading: boolean;
  lastFetched: number | null;
  setCustomers: (customers: User[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCustomers: (query?: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  lastFetched: null,
  setCustomers: (customers) => set({ customers, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchCustomers: async () => {
    const state = get();
    if (state.customers.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 600000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const data = await CustomerService.getAll();
      set({ customers: data, lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
