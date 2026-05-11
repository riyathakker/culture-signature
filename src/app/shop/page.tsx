"use client";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get("categoryId");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = categoryIdParam
          ? `/api/products?categoryId=${categoryIdParam}`
          : "/api/products";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        toast.error("Could not load the collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryIdParam]);

  return (
    <HomePageContainer label="Shop All" heading="The Collection" description="Explore our curated selection of handcrafted jewels, bags, and home decor that celebrate Indian heritage.">

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center border-b pb-6">
            <div className="flex items-center gap-4">
              <FilterDrawer />
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Showing {products.length} pieces
              </p>
            </div>
            <ShopControls />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <p className="text-muted-foreground font-serif italic text-lg">No matches found in the current collection.</p>
              <button
                onClick={() => window.location.href = "/shop"}
                className="text-primary underline text-sm uppercase tracking-widest font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
              {products.map((product) => (
                <ProductCard key={product.id} product={{
                  ...product,
                  name: product.title,
                  image: product.images?.[0] || "/placeholder.jpg",
                  category: product.category?.name || "Uncategorized"
                }} />
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="pt-20 flex justify-center">
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-primary bg-primary text-primary-foreground font-bold text-xs">1</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </HomePageContainer>
  );
}
