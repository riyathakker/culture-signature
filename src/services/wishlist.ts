import { api } from "./api";
import { Product } from "@/types";

export class WishlistService {
  static async getWishlist(): Promise<Product[]> {
    return api<Product[]>({
      method: "GET",
      endpoint: "/wishlist",
    });
  }

  static async addItem(productId: string): Promise<void> {
    await api<void>({
      method: "POST",
      endpoint: "/wishlist",
      body: { productId },
    });
  }

  static async removeItem(productId: string): Promise<void> {
    await api<void>({
      method: "DELETE",
      endpoint: "/wishlist",
      body: { productId },
    });
  }
}
