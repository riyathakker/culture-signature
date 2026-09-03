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
    if (!id) return;
    let cancelled = false;

    // Fetch the product itself with a couple of retries so a transient error
    // or Neon cold-start on refresh doesn't wrongly render "no product found".
    // A genuine 404 stops immediately (no point retrying a missing product).
    const fetchProduct = async () => {
      setLoading(true);
      let data: any = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
          if (res.status === 404) {
            if (!cancelled) { setProduct(null); setLoading(false); }
            return;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          data = await res.json();
          break;
        } catch (error) {
          if (attempt === 2) {
            console.error("[ProductPage] load failed after retries", error);
            if (!cancelled) { toast.error(t("shop.product.details.loadError")); setLoading(false); }
            return;
          }
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        }
      }

      if (cancelled || !data) return;

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
      setLoading(false);

      // Related products are best-effort — never let them affect the product view.
      if (data.categoryId) {
        try {
          const relRes = await fetch(`/api/products?categoryId=${data.categoryId}&limit=5`);
          const relData = await relRes.json();
          if (!cancelled) {
            setRelatedProducts(
              (Array.isArray(relData) ? relData : [])
                .filter((p: any) => p.id !== id)
                .slice(0, 4)
            );
          }
        } catch {
          /* ignore related-products failure */
        }
      }
    };

    fetchProduct();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-4">
          <ProductGallery images={galleryImages} />
          <ProductInfo product={product} onColorChange={setGalleryImages} />
        </div>

        <div className="mt-7">
          <ProductReviews productName={product.name} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-7">
            <SectionTitle
              title={t("shop.product.details.relatedTitle")}
              subtitle={t("shop.product.details.relatedSubtitle")}
              align="center"
            />
            <div
              className={
                "mt-7 grid grid-cols-2 md:grid-cols-4 gap-6 md:mx-auto " +
                // PWA: collapse to a single horizontal scroll row
                "[@media(display-mode:standalone)]:flex [@media(display-mode:standalone)]:max-w-none [@media(display-mode:standalone)]:mx-0 " +
                "[@media(display-mode:standalone)]:flex-nowrap [@media(display-mode:standalone)]:overflow-x-auto [@media(display-mode:standalone)]:gap-4 " +
                "[@media(display-mode:standalone)]:snap-x [@media(display-mode:standalone)]:snap-mandatory [@media(display-mode:standalone)]:pb-2 no-scrollbar"
              }
            >
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="[@media(display-mode:standalone)]:min-w-[46%] [@media(display-mode:standalone)]:shrink-0 [@media(display-mode:standalone)]:snap-start"
                >
                  <ProductCard product={p} hideActions />
                </div>
              ))}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}
