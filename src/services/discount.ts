import { api } from "./api";
import { Discount } from "@/types";

export class DiscountService {
  static async getAll(params?: { page?: number; limit?: number; query?: string }): Promise<Discount[] | { items: Discount[]; total: number }> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return api<Discount[] | { items: Discount[]; total: number }>({
      method: "GET",
      endpoint: `/admin/discounts${queryParams ? `?${queryParams}` : ""}`,
    });
  }

  static async create(data: any): Promise<Discount> {
    return api<Discount>({
      method: "POST",
      endpoint: "/admin/discounts",
      body: data,
    });
  }

  static async update(id: string, data: any): Promise<Discount> {
    return api<Discount>({
      method: "PATCH",
      endpoint: `/admin/discounts/${id}`,
      body: data,
    });
  }

  static async delete(id: string): Promise<void> {
    await api<{ success: boolean }>({
      method: "DELETE",
      endpoint: `/admin/discounts/${id}`,
    });
  }
}
