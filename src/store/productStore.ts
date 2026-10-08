import { create } from "zustand";
import { Product } from "@/types";
import { ProductService } from "@/services/product";

export interface ShopFilters {
  categoryIds?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  hasDiscount?: boolean;
  sort?: string;
}

const SHOP_PAGE_SIZE = 12;

// Fetches one page of shop products from the paginated API.
async function fetchShopPage(filters: ShopFilters, page: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(SHOP_PAGE_SIZE));
  if (filters.categoryIds?.length) params.set("categoryId", filters.categoryIds.join(","));
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.inStock) params.set("inStock", "true");
  if (filters.hasDiscount) params.set("hasDiscount", "true");
  if (filters.sort) params.set("sort", filters.sort);

  const res = await fetch(`/api/products?${params.toString()}`);
  const data = await res.json();
  return {
    items: (Array.isArray(data?.items) ? data.items : []) as Product[],
    total: (data?.total ?? 0) as number,
    hasMore: Boolean(data?.hasMore),
    priceMax: (data?.priceMax ?? 0) as number,
  };
}

interface ProductState {
  products: Product[];
  totalProducts: number;
  newArrivals: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  lastFetched: number | null;
  lastFetchedNewArrivals: number | null;
  lastFetchedFeatured: number | null;

  // Shop/collections infinite-scroll slice
  shopProducts: Product[];
  shopTotal: number;
  shopPage: number;
  shopFilters: ShopFilters;
  shopHasMore: boolean;
  shopPriceMax: number;
  shopLoading: boolean;      // first page (shows skeletons)
  shopLoadingMore: boolean;  // next pages (shows a spinner)

  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;

  fetchProducts: (force?: boolean, params?: { page?: number; limit?: number; query?: string; categoryId?: string; status?: string }) => Promise<void>;
  fetchNewArrivals: (force?: boolean) => Promise<void>;
  fetchFeaturedProducts: (force?: boolean) => Promise<void>;
  loadShopProducts: (filters: ShopFilters) => Promise<void>;  // page 1 (filters changed)
  loadMoreShopProducts: () => Promise<void>;                  // next page (scroll)

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

  shopProducts: [],
  shopTotal: 0,
  shopPage: 0,
  shopFilters: {},
  shopHasMore: false,
  shopPriceMax: 0,
  shopLoading: false,
  shopLoadingMore: false,

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

  // Load the first page for the current filters (called when filters change).
  loadShopProducts: async (filters) => {
    set({ shopLoading: true, shopFilters: filters, shopPage: 1 });
    try {
      const data = await fetchShopPage(filters, 1);
      set({
        shopProducts: data.items,
        shopTotal: data.total,
        shopHasMore: data.hasMore,
        shopPriceMax: data.priceMax || get().shopPriceMax,
      });
    } catch (error) {
      console.error("Failed to load shop products", error);
      set({ shopProducts: [], shopTotal: 0, shopHasMore: false });
    } finally {
      set({ shopLoading: false });
    }
  },

  // Load the next page and append it (called on scroll).
  loadMoreShopProducts: async () => {
    const { shopLoading, shopLoadingMore, shopHasMore, shopPage, shopFilters } = get();
    if (shopLoading || shopLoadingMore || !shopHasMore) return;

    const nextPage = shopPage + 1;
    set({ shopLoadingMore: true });
    try {
      const data = await fetchShopPage(shopFilters, nextPage);
      set((s) => ({
        shopProducts: [...s.shopProducts, ...data.items],
        shopTotal: data.total,
        shopPage: nextPage,
        shopHasMore: data.hasMore,
      }));
    } catch (error) {
      console.error("Failed to load more shop products", error);
    } finally {
      set({ shopLoadingMore: false });
    }
  },
}));