import { create } from "zustand";
import { Product } from "@/types";
import { ProductService } from "@/services/product";

interface ProductState {
  products: Product[];
  totalProducts: number;
  newArrivals: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  lastFetched: number | null;
  lastFetchedNewArrivals: number | null;
  lastFetchedFeatured: number | null;

  setProducts: (products: Product[]) => void;
  setNewArrivals: (newArrivals: Product[]) => void;
  setFeaturedProducts: (featuredProducts: Product[]) => void;
  setLoading: (isLoading: boolean) => void;

  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;

  fetchProducts: (force?: boolean, params?: { page?: number; limit?: number; query?: string; categoryId?: string; status?: string }) => Promise<void>;
  fetchNewArrivals: (force?: boolean) => Promise<void>;
  fetchFeaturedProducts: (force?: boolean) => Promise<void>;

  createProduct: (data: any) => Promise<Product>;
  updateProductById: (id: string, data: any) => Promise<Product>;
  deleteProductById: (id: string) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  totalProducts: 0,
  newArrivals: [],
  featuredProducts: [],
  isLoading: false,
  lastFetched: null,
  lastFetchedNewArrivals: null,
  lastFetchedFeatured: null,

  setProducts: (products) =>
    set({
      products,
      totalProducts: products.length,
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

  createProduct: async (data: any): Promise<Product> => {
    const product = await ProductService.create(data);
    get().addProduct(product);
    return product;
  },

  updateProductById: async (id: string, data: any): Promise<Product> => {
    const product = await ProductService.update(id, data);
    get().updateProduct(product);
    return product;
  },

  deleteProductById: async (id: string): Promise<void> => {
    await ProductService.delete(id);
    get().deleteProduct(id);
  },

  fetchProductById: async (id: string): Promise<Product> => {
    return ProductService.getById(id);
  },

  fetchProducts: async (force = false, params) => {
    const state = get();

    // Cache for 5 minutes (skip cache if pagination params are active)
    if (
      !force &&
      !params &&
      state.products.length > 0 &&
      state.lastFetched &&
      Date.now() - state.lastFetched < 300000
    ) {
      return;
    }

    set({ isLoading: true });

    try {
      const data = await ProductService.getAllAdmin(params);

      if (data && typeof data === "object" && "items" in data) {
        set({
          products: data.items,
          totalProducts: data.total,
          lastFetched: Date.now(),
        });
      } else {
        const prodList = Array.isArray(data) ? data : [];
        set({
          products: prodList,
          totalProducts: prodList.length,
          lastFetched: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNewArrivals: async (force = false) => {
    const state = get();

    // Cache for 5 minutes
    if (!force && state.newArrivals.length > 0 && state.lastFetchedNewArrivals && (Date.now() - state.lastFetchedNewArrivals < 300000)) {
      return;
    }

    set({ isLoading: true });

    try {
      const data = await ProductService.getNewArrivals();

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

  fetchFeaturedProducts: async (force = false) => {
    const state = get();

    // Cache for 5 minutes
    if (!force && state.featuredProducts.length > 0 && state.lastFetchedFeatured && (Date.now() - state.lastFetchedFeatured < 300000)) {
      return;
    }

    set({ isLoading: true });

    try {
      const data = await ProductService.getFeatured();

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