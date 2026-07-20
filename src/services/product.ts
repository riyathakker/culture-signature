import { api } from "./api";
import { Product } from "@/types";

export class ProductService {
  static async getAllAdmin(params?: { page?: number; limit?: number; query?: string; categoryId?: string; status?: string }): Promise<Product[] | { items: Product[]; total: number }> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return api<Product[] | { items: Product[]; total: number }>({
      method: "GET",
      endpoint: `/admin/products${queryParams ? `?${queryParams}` : ""}`,
    });
  }

  static async getById(id: string): Promise<Product> {
    return api<Product>({
      method: "GET",
      endpoint: `/admin/products/${id}`,
    });
  }

  static async getNewArrivals(): Promise<Product[]> {
    return api<Product[]>({
      method: "GET",
      endpoint: "/products?isNew=true",
    });
  }

  static async getFeatured(): Promise<Product[]> {
    return api<Product[]>({
      method: "GET",
      endpoint: "/products?isFeatured=true",
    });
  }

  static async create(data: any): Promise<Product> {
    return api<Product>({
      method: "POST",
      endpoint: "/admin/products",
      body: data,
    });
  }

  static async update(id: string, data: any): Promise<Product> {
    return api<Product>({
      method: "PATCH",
      endpoint: `/admin/products/${id}`,
      body: data,
    });
  }

  static async delete(id: string): Promise<void> {
    await api<{ success: boolean }>({
      method: "DELETE",
      endpoint: `/admin/products/${id}`,
    });
  }

  static async bulkCreate(
    products: {
      title: string;
      description: string;
      price: string;
      discount: string;
      stock: string;
      categoryId: string;
      images: string[];
      isFeatured: boolean;
    }[]
  ): Promise<{ results: Product[]; errors: { index: number; message: string }[] }> {
    const results: Product[] = [];
    const errors: { index: number; message: string }[] = [];

    await Promise.allSettled(
      products.map((product, index) =>
        ProductService.create(product)
          .then((p) => results.push(p))
          .catch((e: Error) => errors.push({ index, message: e.message }))
      )
    );

    return { results, errors };
  }
}
