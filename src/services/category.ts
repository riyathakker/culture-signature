import { api } from "./api";
import { Category } from "@/types";

export class CategoryService {
  static async getAll(includeArchived = false, params?: { page?: number; limit?: number; query?: string }): Promise<Category[] | { items: Category[]; total: number }> {
    const queryParams = new URLSearchParams(
      Object.entries({
        includeArchived: String(includeArchived),
        ...params
      })
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
    ).toString();
    return api<Category[] | { items: Category[]; total: number }>({
      method: "GET",
      endpoint: `/categories?${queryParams}`,
    });
  }

  static async create(name: string): Promise<Category> {
    return api<Category>({
      method: "POST",
      endpoint: "/admin/categories",
      body: { name },
    });
  }

  static async update(id: string, name: string, status: "ACTIVE" | "ARCHIVED"): Promise<Category> {
    return api<Category>({
      method: "PATCH",
      endpoint: "/admin/categories",
      body: { id, name, status },
    });
  }

  static async delete(id: string): Promise<void> {
    await api<{ success: boolean }>({
      method: "DELETE",
      endpoint: `/admin/categories?id=${id}`,
    });
  }
}
