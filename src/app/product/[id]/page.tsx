import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductPageClient } from "./ProductPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.culturesignature.com";

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id, isDeleted: false },
    include: { category: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found | Culture Signature" };
  }

  const title = `${product.name} | Culture Signature`;
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.name} from Culture Signature — luxury jewellery & timepieces.`;
  const url = `${SITE_URL}/product/${product.id}`;
  const images = product.images?.length ? product.images : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || undefined,
        image: product.images,
        sku: product.id,
        brand: { "@type": "Brand", name: "Culture Signature" },
        category: product.category?.name,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/product/${product.id}`,
          priceCurrency: "INR",
          price: product.price,
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageClient />
    </>
  );
}
