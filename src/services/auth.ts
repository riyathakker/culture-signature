import { api } from "./api";

export class AuthService {
  static async signup(data: any): Promise<any> {
    return api<any>({
      method: "POST",
      endpoint: "/auth/signup",
      body: data,
    });
  }

  static async deleteAccount(data: any): Promise<any> {
    return api<any>({
      method: "POST",
      endpoint: "/auth/delete-account",
      body: data,
    });
  }

  static async updateProfile(data: any): Promise<any> {
    return api<any>({
      method: "PATCH",
      endpoint: "/user/update",
      body: data,
    });
  }
}
