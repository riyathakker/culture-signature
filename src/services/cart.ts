import { api } from "./api";
import { CartItem } from "@/types";

export class CartService {
  static async getCart(): Promise<CartItem[]> {
    return api<CartItem[]>({
      method: "GET",
      endpoint: "/cart",
    });
  }

  static async addItem(productId: string, quantity: number, color = ""): Promise<void> {
    await api<void>({
      method: "POST",
      endpoint: "/cart",
      body: { productId, quantity, color },
    });
  }

  static async removeItem(productId: string, color = ""): Promise<void> {
    await api<void>({
      method: "DELETE",
      endpoint: "/cart",
      body: { productId, color },
    });
  }

  static async updateQuantity(productId: string, quantity: number, color = ""): Promise<void> {
    await api<void>({
      method: "PUT",
      endpoint: "/cart",
      body: { productId, quantity, color },
    });
  }

  static async clearCart(): Promise<void> {
    await api<void>({
      method: "DELETE",
      endpoint: "/cart",
      body: {},
    });
  }
}
