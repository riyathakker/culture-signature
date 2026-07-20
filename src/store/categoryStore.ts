import { create } from "zustand";
import { Category } from "@/types";
import { CategoryService } from "@/services/category";

interface CategoryState {
  categories: Category[];
  totalCategories: number;
  isLoading: boolean;
  showingArchived: boolean;
  lastFetched: number | null;
  setCategories: (categories: Category[]) => void;
  setLoading: (isLoading: boolean) => void;
  fetchCategories: (includeArchived?: boolean, params?: { page?: number; limit?: number; query?: string }) => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  createCategory: (name: string, image?: string | null) => Promise<Category>;
  updateCategoryById: (id: string, name: string, status: "ACTIVE" | "ARCHIVED", image?: string | null) => Promise<Category>;
  deleteCategoryById: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  totalCategories: 0,
  isLoading: false,
  showingArchived: false,
  lastFetched: null,
  setCategories: (categories) => set({ categories, totalCategories: categories.length, lastFetched: Date.now() }),
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

  createCategory: async (name: string, image?: string | null): Promise<Category> => {
    const category = await CategoryService.create(name, image);
    get().addCategory(category);
    return category;
  },

  updateCategoryById: async (id: string, name: string, status: "ACTIVE" | "ARCHIVED", image?: string | null): Promise<Category> => {
    const category = await CategoryService.update(id, name, status, image);
    get().updateCategory(category);
    return category;
  },

  deleteCategoryById: async (id: string): Promise<void> => {
    await CategoryService.delete(id);
    get().deleteCategory(id);
  },

  fetchCategories: async (includeArchived = false, params) => {
    const state = get();

    // Invalidate cache if we need a different set of categories (active-only vs including archived)
    const needsRefetch = includeArchived !== state.showingArchived;

    if (
      !needsRefetch &&
      !params &&
      state.categories.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < 600000
    ) {
      return;
    }

    set({ isLoading: true, showingArchived: includeArchived });
    try {
      const data = await CategoryService.getAll(includeArchived, params);

      if (data && typeof data === "object" && "items" in data) {
        set({
          categories: data.items,
          totalCategories: data.total,
          lastFetched: Date.now(),
        });
      } else if (Array.isArray(data)) {
        set({
          categories: data,
          totalCategories: data.length,
          lastFetched: Date.now(),
        });
      } else {
        console.error("Categories response is not recognized:", data);
        set({ categories: [], totalCategories: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      set({ categories: [], totalCategories: 0 });
    } finally {
      set({ isLoading: false });
    }
  },
}));
