import { resolveVariant } from "./colorVariant";

// Mirrors the display math in cartStore/CartSummary — this file is the
// server-trusted source of truth; client numbers are never used to price an order.
const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 200;
// Cashfree/float rounding can differ by fractions of a rupee between the
// amount charged and the amount recomputed here.
export const AMOUNT_TOLERANCE = 1;

export interface RequestedItem {
  id: string;
  quantity: number;
  color?: string | null;
}

export interface ProductForPricing {
  id: string;
  name: string;
  price: number;
  discount?: number | null;
  stock: number;
  images: string[];
  colors?: unknown;
}

export interface ResolvedLine {
  productId: string;
  name: string;
  quantity: number;
  color: string;
  unitPrice: number;
}

export function resolveOrderLines(
  items: RequestedItem[],
  products: Map<string, ProductForPricing>
): { lines: ResolvedLine[] | null; error: string | null } {
  if (!items?.length) return { lines: null, error: "No items provided." };

  const lines: ResolvedLine[] = [];
  for (const item of items) {
    const product = products.get(item.id);
    if (!product) return { lines: null, error: "One or more items are no longer available." };

    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { lines: null, error: `Invalid quantity for "${product.name}".` };
    }

    const color = item.color || "";
    const variant = resolveVariant(product, color);
    if (quantity > variant.stock) {
      return { lines: null, error: `Only ${variant.stock} of "${product.name}" left in stock.` };
    }

    lines.push({ productId: product.id, name: product.name, quantity, color, unitPrice: variant.price });
  }

  return { lines, error: null };
}

export interface DiscountLike {
  type: "PERCENTAGE" | "FIXED";
  value: number;
  status: string;
  expiryDate: Date | null;
  usageLimit: number | null;
  usedCount: number;
}

export function isDiscountUsable(discount: DiscountLike): boolean {
  if (discount.status !== "ACTIVE") return false;
  if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) return false;
  if (discount.usageLimit && discount.usedCount >= discount.usageLimit) return false;
  return true;
}

export interface OrderTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  gstAmount: number;
  shippingCost: number;
  total: number;
}

export function computeOrderTotals(
  lines: ResolvedLine[],
  discount: Pick<DiscountLike, "type" | "value"> | null
): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const discountAmount = discount
    ? discount.type === "PERCENTAGE"
      ? (subtotal * discount.value) / 100
      : Math.min(discount.value, subtotal)
    : 0;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * GST_RATE;
  const shippingCost = taxableAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = taxableAmount + gstAmount + shippingCost;

  return { subtotal, discountAmount, taxableAmount, gstAmount, shippingCost, total };
}
