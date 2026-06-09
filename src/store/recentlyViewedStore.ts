import { create } from "zustand";

export interface RecentProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  images: string[];
  category: string;
}

const STORAGE_KEY = "cs_recently_viewed";

function load(): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function save(products: RecentProduct[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch {}
}

interface RecentlyViewedStore {
  products: RecentProduct[];
  hydrated: boolean;
  hydrate: () => void;
  addProduct: (p: RecentProduct) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()((set, get) => ({
  products: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ products: load(), hydrated: true });
  },

  addProduct: (p) => {
    const next = [p, ...get().products.filter((x) => x.id !== p.id)].slice(0, 10);
    set({ products: next });
    save(next);
  },

  clear: () => { set({ products: [] }); save([]); },
}));
