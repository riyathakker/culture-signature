import { api } from "./api";

export class ContactService {
  static async submitInquiry(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await api<void>({
      method: "POST",
      endpoint: "/contact",
      body: data,
    });
  }
}
