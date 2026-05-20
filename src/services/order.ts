import { api } from "./api";
import { Order } from "@/types";

export class OrderService {
  static async getAll(): Promise<Order[]> {
    return api<Order[]>({
      method: "GET",
      endpoint: "/admin/orders",
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
