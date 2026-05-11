import { create } from 'zustand';

interface CustomerState {
  customers: any[];
  isLoading: boolean;
  lastFetched: number | null;
  setCustomers: (customers: any[]) => void;
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
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      set({ customers: data, lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
