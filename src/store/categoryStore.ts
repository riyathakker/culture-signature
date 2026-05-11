import { create } from 'zustand';

interface CategoryState {
  categories: any[];
  isLoading: boolean;
  lastFetched: number | null;
  setCategories: (categories: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCategories: () => Promise<void>;
  addCategory: (category: any) => void;
  updateCategory: (category: any) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  lastFetched: null,
  setCategories: (categories) => set({ categories, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (category) => set((state) => ({
    categories: state.categories.map((c) => (c.id === category.id ? category : c)),
  })),
  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((c) => c.id !== id),
  })),
  fetchCategories: async () => {
    const state = get();
    // Cache for 10 minutes
    if (state.categories.length > 0 && state.lastFetched && (Date.now() - state.lastFetched < 600000)) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (Array.isArray(data)) {
        set({ categories: data, lastFetched: Date.now() });
      } else {
        console.error("Categories response is not an array:", data);
        set({ categories: [] });
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      set({ categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
