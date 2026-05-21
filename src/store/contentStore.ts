import { create } from "zustand";
import { Exhibition } from "@/types";
import { API_ROUTES } from "@/constants/routes";

interface ContentState {
  exhibitions: Exhibition[];
  isLoading: boolean;

  fetchExhibitions: () => Promise<void>;
  createExhibition: (data: Partial<Exhibition>) => Promise<void>;
  updateExhibition: (id: string, data: Partial<Exhibition>) => Promise<void>;
  deleteExhibition: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  exhibitions: [],
  isLoading: false,

  fetchExhibitions: async () => {
    set({ isLoading: true });
    const res = await fetch(API_ROUTES.ADMIN.EXHIBITIONS);
    const data = await res.json();
    set({ exhibitions: data, isLoading: false });
  },

  createExhibition: async (data) => {
    const res = await fetch(API_ROUTES.ADMIN.EXHIBITIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create exhibition");
    const exhibition = await res.json();
    set((s) => ({ exhibitions: [exhibition, ...s.exhibitions] }));
  },

  updateExhibition: async (id, data) => {
    const res = await fetch(API_ROUTES.ADMIN.EXHIBITION_BY_ID(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update exhibition");
    const exhibition = await res.json();
    set((s) => ({ exhibitions: s.exhibitions.map((e) => (e.id === id ? exhibition : e)) }));
  },

  deleteExhibition: async (id) => {
    const res = await fetch(API_ROUTES.ADMIN.EXHIBITION_BY_ID(id), { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete exhibition");
    set((s) => ({ exhibitions: s.exhibitions.filter((e) => e.id !== id) }));
  },
}));
