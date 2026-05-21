"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/common/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useTranslation } from "@/context/TranslationContext";

export default function ProductPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products`);
        const allProducts = await response.json();
        const foundProduct = allProducts.find((p: any) => p.id === id);

        if (!foundProduct) throw new Error("Product not found");

        setProduct({
          ...foundProduct,
          name: foundProduct.name,
          image: foundProduct.images?.[0] || "/placeholder.jpg",
          category: foundProduct.category?.name || t("shop.product.defaultCollection"),
          categoryId: foundProduct.categoryId,
          details: {
            description: foundProduct.description,
            specifications: [
              { label: t("shop.product.details.specs.category"), value: foundProduct.category?.name || t("shop.product.defaultCollection") },
              { label: t("shop.product.details.specs.stock"), value: foundProduct.stock > 0 ? t("shop.product.details.specs.inStock") : t("shop.product.details.specs.outOfStock") }
            ],
            shipping: t("shop.product.details.shippingNote")
          }
        });

        // Simple related products (same category)
        const related = allProducts
          .filter((p: any) => p.categoryId === foundProduct.categoryId && p.id !== id)
          .slice(0, 3);
        setRelatedProducts(related);

      } catch (error) {
        toast.error(t("shop.product.details.loadError"));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, t]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-xl font-serif italic">{t("shop.product.details.notFound")}</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="py-8">
        <Breadcrumbs
          items={[
            from === "categories"
              ? { label: t("nav.links.categories") || "Categories", href: "/categories" }
              : from === "new-arrivals"
              ? { label: t("nav.links.newArrivals") || "New Arrivals", href: "/new-arrivals" }
              : { label: t("nav.links.collections") || "Collections", href: "/collections" },

            ...(from === "categories"
              ? [{ label: product.category, href: `/categories/${product.categoryId}` }]
              : []),

            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-10">
          <ProductGallery images={product.images || [product.image]} />
          <ProductInfo product={product} />
        </div>

        <div className="mt-20">
          <ProductReviews />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <SectionTitle
              title={t("shop.product.details.relatedTitle")}
              subtitle={t("shop.product.details.relatedSubtitle")}
              align="center"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
