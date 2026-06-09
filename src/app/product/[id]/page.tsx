"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ProductCard } from "@/components/common/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/context/TranslationContext";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";

export default function ProductPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const { t } = useTranslation();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        const colors = Array.isArray(data.colors) ? data.colors : [];
        const defaultImages = (colors.length > 0 && colors[0].images?.length > 0)
          ? colors[0].images
          : data.images || [];
        setGalleryImages(defaultImages);

        addRecentlyViewed({
          id: data.id,
          name: data.name,
          price: data.price,
          discount: data.discount || 0,
          images: data.images || [],
          category: data.category?.name || t("shop.product.defaultCollection"),
        });

        setProduct({
          ...data,
          image: data.images?.[0] || "/placeholder.jpg",
          category: data.category?.name || t("shop.product.defaultCollection"),
          categoryId: data.categoryId,
          colors,
          details: {
            description: data.description,
            specifications: [
              { label: t("shop.product.details.specs.category"), value: data.category?.name || t("shop.product.defaultCollection") },
              { label: t("shop.product.details.specs.stock"), value: data.stock > 0 ? t("shop.product.details.specs.inStock") : t("shop.product.details.specs.outOfStock") },
            ],
            shipping: t("shop.product.details.shippingNote"),
          },
        });

        // Fetch related products from same category
        if (data.categoryId) {
          const relRes = await fetch(`/api/products?categoryId=${data.categoryId}&limit=5`);
          const relData = await relRes.json();
          setRelatedProducts(
            (Array.isArray(relData) ? relData : [])
              .filter((p: any) => p.id !== id)
              .slice(0, 4)
          );
        }
      } catch (error) {
        toast.error(t("shop.product.details.loadError"));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, t]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-serif italic">{t("shop.product.details.notFound")}</p>
      </div>
    );

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="pt-4 pb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mt-4">
          <ProductGallery images={galleryImages.length > 0 ? galleryImages : (product.images || [product.image])} />
          <ProductInfo product={product} onColorChange={setGalleryImages} />
        </div>

        <div className="mt-10">
          <ProductReviews productName={product.name} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <SectionTitle
              title={t("shop.product.details.relatedTitle")}
              subtitle={t("shop.product.details.relatedSubtitle")}
              align="center"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} hideActions />
              ))}
            </div>
          </div>
        )}

        <RecentlyViewed excludeId={String(id)} />
      </Container>
    </div>
  );
}
