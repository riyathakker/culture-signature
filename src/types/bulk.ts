export type RowStatus = "idle" | "loading" | "success" | "error";

export interface BulkRow {
  uid: string;
  title: string;
  description: string;
  price: string;
  discount: string;
  stock: string;
  categoryId: string;
  images: string[];
  isFeatured: boolean;
  status: RowStatus;
  errorMsg?: string;
  showImages: boolean;
}

export interface PoolImage {
  id: string;
  url: string;
}

export interface GlobalDefaults {
  name: string;
  categoryId: string;
  price: string;
  discount: string;
  stock: string;
}
