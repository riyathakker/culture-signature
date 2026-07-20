import { api } from "./api";
import { AdminOverview } from "@/types";

export class AdminService {
  static async getOverview(): Promise<AdminOverview> {
    return api<AdminOverview>({
      method: "GET",
      endpoint: "/admin/overview",
    });
  }
}
