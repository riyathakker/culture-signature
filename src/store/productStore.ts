import { create } from "zustand";

interface ProductState {
  products: any[];
  newArrivals: any[];
  featuredProducts: any[];
  isLoading: boolean;
  lastFetched: number | null;
  lastFetchedNewArrivals: number | null;
  lastFetchedFeatured: number | null;

  setProducts: (products: any[]) => void;
  setNewArrivals: (newArrivals: any[]) => void;
  setFeaturedProducts: (featuredProducts: any[]) => void;
  setLoading: (isLoading: boolean) => void;

  updateProduct: (product: any) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: any) => void;

  fetchProducts: (query?: string, categoryId?: string) => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  newArrivals: [],
  featuredProducts: [],
  isLoading: false,
  lastFetched: null,
  lastFetchedNewArrivals: null,
  lastFetchedFeatured: null,

  setProducts: (products) =>
    set({
      products,
      lastFetched: Date.now(),
    }),

  setNewArrivals: (newArrivals) =>
    set({
      newArrivals,
      lastFetchedNewArrivals: Date.now(),
    }),

  setFeaturedProducts: (featuredProducts) =>
    set({
      featuredProducts,
      lastFetchedFeatured: Date.now(),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === product.id ? product : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),

  fetchProducts: async () => {
    const state = get();

    // Cache for 5 minutes
    if (
      state.products.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < 300000
    ) {
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetch("/api/admin/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      set({
        products: data,
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNewArrivals: async () => {
    const state = get();

    // Cache for 5 minutes
    if (state.newArrivals.length > 0 && state.lastFetchedNewArrivals && (Date.now() - state.lastFetchedNewArrivals < 300000)) {
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetch(
        "/api/products?isNew=true&limit=4"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch new arrivals");
      }

      const data = await response.json();

      set({
        newArrivals: data,
        lastFetchedNewArrivals: Date.now(),
      });
    } catch (error) {
      console.error("Failed to fetch new arrivals", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    const state = get();

    // Cache for 5 minutes
    if (state.featuredProducts.length > 0 && state.lastFetchedFeatured && (Date.now() - state.lastFetchedFeatured < 300000)) {
      return;
    }

    set({ isLoading: true });

    try {
      const response = await fetch("/api/products?limit=4");

      if (!response.ok) {
        throw new Error("Failed to fetch featured products");
      }

      const data = await response.json();

      set({
        featuredProducts: data,
        lastFetchedFeatured: Date.now(),
      });
    } catch (error) {
      console.error("Failed to fetch featured products", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));