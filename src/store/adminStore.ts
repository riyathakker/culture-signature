import { create } from 'zustand';

interface AdminState {
  overview: any | null;
  isLoading: boolean;
  lastFetched: number | null;
  fetchOverview: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  overview: null,
  isLoading: false,
  lastFetched: null,
  fetchOverview: async () => {
    const state = get();
    // Cache for 5 minutes
    if (state.overview && state.lastFetched && (Date.now() - state.lastFetched < 300000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/admin/overview");
      if (!response.ok) throw new Error("Failed to fetch overview");
      const data = await response.json();
      set({ overview: data, lastFetched: Date.now() });
    } catch (error) {
      console.error("Failed to fetch overview", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
