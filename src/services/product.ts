import { api } from "./api";
import { Product } from "@/types";

export class ProductService {
  static async getAllAdmin(): Promise<Product[]> {
    return api<Product[]>({
      method: "GET",
      endpoint: "/admin/products",
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
}
