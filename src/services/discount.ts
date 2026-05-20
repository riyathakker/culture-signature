import { api } from "./api";
import { Discount } from "@/types";

export class DiscountService {
  static async getAll(): Promise<Discount[]> {
    return api<Discount[]>({
      method: "GET",
      endpoint: "/admin/discounts",
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
