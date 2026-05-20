import { api } from "./api";

export class AddressService {
  static async getAddresses(): Promise<any[]> {
    return api<any[]>({
      method: "GET",
      endpoint: "/user/address",
    });
  }

  static async createAddress(data: any): Promise<any> {
    return api<any>({
      method: "POST",
      endpoint: "/user/address",
      body: data,
    });
  }

  static async updateAddress(data: any): Promise<any> {
    return api<any>({
      method: "PATCH",
      endpoint: "/user/address",
      body: data,
    });
  }

  static async deleteAddress(id: string): Promise<void> {
    await api<void>({
      method: "DELETE",
      endpoint: `/user/address?id=${id}`,
    });
  }
}
