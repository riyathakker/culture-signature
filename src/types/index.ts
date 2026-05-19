export type Role = "ADMIN" | "USER";

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type CategoryStatus = "ACTIVE" | "ARCHIVED";

export type DiscountStatus = "ACTIVE" | "EXPIRED";

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  mobileNo: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status?: CategoryStatus;
  isArchived?: boolean;
  createdAt?: string | Date;
  isDeleted?: boolean;
  products?: Product[];
  _count?: {
    products?: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  categoryId: string;
  isFeatured: boolean;
  isNew?: boolean;
  rating?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
  category?: Category | string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  userId?: string;
  productId?: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt?: string | Date;
  product?: Product;
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt?: string | Date;
  isDeleted?: boolean;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string | null;
  totalPrice: number;
  discountAmount: number;
  promoCode: string | null;
  customerName: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string;
  phone: string | null;
  status: OrderStatus;
  shippedAt?: string | Date | null;
  deliveredAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  isDeleted: boolean;
  user?: User | null;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string | Date;
  isDeleted: boolean;
  product?: Product;
  user?: User;
}

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  usageLimit: number | null;
  usedCount: number;
  status: DiscountStatus;
  expiryDate: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isDeleted?: boolean;
}

export interface AdminOverview {
  revenue: number;
  activeOrders: number;
  customers: number;
  totalProducts: number;
  recentOrders: Order[];
  lowStockProducts: Product[];
}
