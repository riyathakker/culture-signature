import { api } from "./api";
import { User } from "@/types";

export class CustomerService {
  static async getAll(): Promise<User[]> {
    return api<User[]>({
      method: "GET",
      endpoint: "/admin/users",
    });
  }
}
