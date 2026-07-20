import { api } from "./api";
import { User } from "@/types";

export class CustomerService {
  static async getAll(params?: { page?: number; limit?: number; query?: string; role?: string }): Promise<User[] | { items: User[]; total: number }> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString() : "";
    return api<User[] | { items: User[]; total: number }>({
      method: "GET",
      endpoint: `/admin/users${queryParams ? `?${queryParams}` : ""}`,
    });
  }
}
