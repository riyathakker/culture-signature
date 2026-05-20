import { api } from "./api";

export class ReviewService {
  static async getProductReviews(productId: string): Promise<any[]> {
    return api<any[]>({
      method: "GET",
      endpoint: `/reviews?productId=${productId}`,
    });
  }

  static async submitReview(data: {
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
  }): Promise<void> {
    await api<void>({
      method: "POST",
      endpoint: "/reviews",
      body: data,
    });
  }
}
