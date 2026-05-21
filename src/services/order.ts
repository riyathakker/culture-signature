import { api } from "./api";
import { Order } from "@/types";

export class OrderService {
  static async getAll(params?: { page?: number; limit?: number; query?: string; status?: string }): Promise<Order[] | { items: Order[]; total: number }> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return api<Order[] | { items: Order[]; total: number }>({
      method: "GET",
      endpoint: `/admin/orders${queryParams ? `?${queryParams}` : ""}`,
    });
  }

  static async updateStatus(orderId: string, status: string): Promise<Order> {
    return api<Order>({
      method: "PATCH",
      endpoint: `/admin/orders/${orderId}`,
      body: { status },
    });
  }
}
