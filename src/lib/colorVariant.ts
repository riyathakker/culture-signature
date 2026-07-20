import type { ColorVariant } from "@/types";

type PricingProduct = {
  price: number;
  discount?: number | null;
  stock: number;
  images: string[];
  colors?: unknown;
};

export type ResolvedVariant = {
  /** Net unit price (per-color price if set, else base price) minus discount. */
  price: number;
  /** Gross unit price before discount. */
  basePrice: number;
  /** Effective available stock for the selected color (or the product). */
  stock: number;
  /** Primary image for the selected color (or the product). */
  image: string;
  /** Selected color's hex, if any. */
  colorHex: string;
  /** Whether the product defines any color variants. */
  hasVariants: boolean;
};

/**
 * Resolves effective price/stock/image for a product given a selected color.
 * Per-color price and stock fall back to the product's base values when unset.
 */
export function resolveVariant(
  product: PricingProduct,
  color?: string | null
): ResolvedVariant {
  const colors = Array.isArray(product.colors)
    ? (product.colors as ColorVariant[])
    : [];
  const discount = product.discount || 0;
  const variant = color ? colors.find((c) => c.name === color) : undefined;

  const basePrice =
    variant?.price != null && variant.price !== undefined
      ? Number(variant.price)
      : product.price;
  const stock =
    variant?.stock != null && variant.stock !== undefined
      ? Number(variant.stock)
      : product.stock;
  const image = variant?.images?.[0] || product.images?.[0] || "";

  return {
    price: basePrice - discount,
    basePrice,
    stock,
    image,
    colorHex: variant?.hex ?? "",
    hasVariants: colors.length > 0,
  };
}
