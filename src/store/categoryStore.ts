import { create } from "zustand";

interface CategoryState {
  categories: any[];
  isLoading: boolean;
  showingArchived: boolean;
  lastFetched: number | null;
  setCategories: (categories: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCategories: (includeArchived?: boolean) => Promise<void>;
  addCategory: (category: any) => void;
  updateCategory: (category: any) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  showingArchived: false,
  lastFetched: null,
  setCategories: (categories) => set({ categories, lastFetched: Date.now() }),
  setLoading: (isLoading) => set({ isLoading }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  fetchCategories: async (includeArchived = false) => {
    const state = get();

    // Invalidate cache if we need a different set of categories (active-only vs including archived)
    const needsRefetch = includeArchived !== state.showingArchived;

    if (
      !needsRefetch &&
      state.categories.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < 600000
    ) {
      return;
    }

    set({ isLoading: true, showingArchived: includeArchived });
    try {
      const response = await fetch(
        `/api/categories?includeArchived=${includeArchived}`
      );

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
