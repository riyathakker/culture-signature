"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ProductCard } from "@/components/common/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";

export function ProductPageClient({ initialProduct }: { initialProduct: any }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { t } = useTranslation();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);

  // The server component already fetched this product, so shape it into the
  // view model and render immediately — no client refetch, no loading spinner
  // on the critical path.
  const shaped = useMemo(() => {
    const data = initialProduct;
    if (!data) return null;
    const colors = Array.isArray(data.colors) ? data.colors : [];
    const images = (colors.length > 0 && colors[0].images?.length > 0)
      ? colors[0].images
      : data.images || [];
    const product = {
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
    };
    return { product, images };
  }, [initialProduct, t]);

  const product = shaped?.product ?? null;
  const [galleryImages, setGalleryImages] = useState<string[]>(shaped?.images ?? []);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  // Side effects that must NOT block the product view: reset the gallery when
  // navigating to another product, record "recently viewed", and load related
  // products (which live below the fold).
  useEffect(() => {
    if (!initialProduct) return;
    let cancelled = false;

    setGalleryImages(shaped?.images ?? []);

    addRecentlyViewed({
      id: initialProduct.id,
      name: initialProduct.name,
      price: initialProduct.price,
      discount: initialProduct.discount || 0,
      images: initialProduct.images || [],
      category: initialProduct.category?.name || t("shop.product.defaultCollection"),
    });

    if (initialProduct.categoryId) {
      (async () => {
        try {
          const relRes = await fetch(`/api/products?categoryId=${initialProduct.categoryId}&limit=5`);
          const relData = await relRes.json();
          if (!cancelled) {
            setRelatedProducts(
              (Array.isArray(relData) ? relData : [])
                .filter((p: any) => p.id !== initialProduct.id)
                .slice(0, 4)
            );
          }
        } catch {
          /* ignore related-products failure */
        }
      })();
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct?.id]);

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl font-serif italic">{t("shop.product.details.notFound")}</p>
      </div>
    );

  return (
    <div className="bg-background min-h-screen pb-8">
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
