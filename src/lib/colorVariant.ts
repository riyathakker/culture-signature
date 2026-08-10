import type { CSSProperties } from "react";
import type { ColorVariant } from "@/types";

export function swatchStyle(hex: string, hex2?: string | null): CSSProperties {
  if (hex2) {
    return { background: `linear-gradient(135deg, ${hex} 0 50%, ${hex2} 50% 100%)` };
  }
  return { backgroundColor: hex };
}

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
 * Resolves the price/stock/image for a product given a selected color.
 * Price and stock always come from the base product; only the image and hex
 * are color-specific.
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
  const image = variant?.images?.[0] || product.images?.[0] || "";

  return {
    price: product.price - discount,
    basePrice: product.price,
    stock: product.stock,
    image,
    colorHex: variant?.hex ?? "",
    hasVariants: colors.length > 0,
  };
}
