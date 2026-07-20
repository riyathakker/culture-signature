import { create } from "zustand";

interface AccountUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  orderCount: number;
  wishlistCount: number;
  latestOrder: {
    id: string;
    status: string;
    createdAt: string;
    totalPrice: number;
  } | null;
}

interface AccountStore {
  user: AccountUser | null;
  isLoading: boolean;
  lastFetched: number | null;

  fetchAccount: (force?: boolean) => Promise<void>;
  invalidate: () => void;
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  user: null,
  isLoading: false,
  lastFetched: null,

  fetchAccount: async (force = false) => {
    const { lastFetched, isLoading } = get();
    if (!force && !isLoading && lastFetched && Date.now() - lastFetched < 60000) return;
    set({ isLoading: true });
    try {
      const res = await fetch("/api/account");
      if (!res.ok) throw new Error("Failed");
      const user = await res.json();
      set({ user, isLoading: false, lastFetched: Date.now() });
    } catch {
      set({ isLoading: false });
    }
  },

  invalidate: () => set({ lastFetched: null }),
}));
