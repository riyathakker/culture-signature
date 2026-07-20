import { api } from "./api";

export class UploadService {
  static async uploadImage(formData: FormData): Promise<{ url: string }> {
    return api<{ url: string }>({
      method: "POST",
      endpoint: "/upload",
      body: formData,
    });
  }
}
