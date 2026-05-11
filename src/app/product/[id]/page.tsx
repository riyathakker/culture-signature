"use client";

import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

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
          name: foundProduct.title,
          image: foundProduct.images?.[0] || "/placeholder.jpg",
          category: foundProduct.category?.name || "Uncategorized",
          categoryId: foundProduct.categoryId,
          details: {
            description: foundProduct.description,
            specifications: [
              { label: "Category", value: foundProduct.category?.name || "Uncategorized" },
              { label: "Stock", value: foundProduct.stock > 0 ? "In Stock" : "Out of Stock" }
            ],
            shipping: "Complimentary worldwide shipping on all orders over ₹10,000."
          }
        });

        // Simple related products (same category)
        const related = allProducts
          .filter((p: any) => p.categoryId === foundProduct.categoryId && p.id !== id)
          .slice(0, 3);
        setRelatedProducts(related);

      } catch (error) {
        toast.error("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-xl font-serif italic">Product not found.</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-20">
      <Container className="py-8">
        <Breadcrumbs items={[
          { label: "Collections", href: "/collections" },
          { label: product.category, href: `/collections/${product.categoryId}` },
          { label: product.name }
        ]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-10">
          {/* Gallery */}
          <ProductGallery images={product.images || [product.image]} />

          {/* Info */}
          <ProductInfo product={product} />
        </div>

        {/* Details & Reviews */}
        <div className="mt-20">
          <ProductTabs details={product.details} />
          <ProductReviews />
        </div>

        {/* Related Products */}
        <div className="mt-32">
          <SectionTitle title="Complete the Look" subtitle="You May Also Desire" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={{
                ...p,
                name: p.title,
                image: p.images?.[0] || "/placeholder.jpg",
                category: p.category?.name || "Uncategorized",
                rating: 5, // Mock rating if not in DB
                description: p.description
              }} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
