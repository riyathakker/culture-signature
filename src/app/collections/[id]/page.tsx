"use client";

import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { HomePageContainer } from "@/components/common/HomePageContainer";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Category Details
        const catRes = await fetch("/api/categories");
        const categories = await catRes.json();
        const currentCat = categories.find((c: any) => c.id === id);
        setCategory(currentCat);

        // Fetch Products
        const prodRes = await fetch(`/api/products?categoryId=${id}`);
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const data = await prodRes.json();
        setProducts(data);
      } catch (error) {
        toast.error("Could not load the collection.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return (
    <HomePageContainer 
      label={[{ label: "Collections", href: "/collections" }]}
      heading={category?.name || "The Collection"} 
      description={category?.description || `Explore our curated selection of handcrafted ${category?.name?.toLowerCase() || 'pieces'} that celebrate heritage and style.`}
    >
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex justify-between items-center border-b border-muted-foreground/10 pb-6">
              <div className="flex items-center gap-4">
                <FilterDrawer />
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                  Showing {products.length} {products.length === 1 ? 'piece' : 'pieces'}
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
              <div className="py-32 text-center space-y-6">
                <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-serif italic text-muted-foreground">?</span>
                </div>
                <p className="text-muted-foreground font-serif italic text-xl">No masterpieces found in this curation yet.</p>
                <button 
                  onClick={() => window.location.href = "/collections"}
                  className="text-primary hover:text-primary/70 transition-colors text-sm uppercase tracking-[0.2em] font-bold border-b border-primary/30 pb-1"
                >
                  Explore All Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in duration-1000">
                {products.map((product) => (
                  <ProductCard product={product} />
                ))}
              </div>
            )}

            {!loading && products.length > 0 && (
              <div className="pt-20 flex justify-center border-t border-muted-foreground/10">
                <div className="flex gap-4">
                  <button className="w-12 h-12 flex items-center justify-center border border-primary bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all duration-300">1</button>
                </div>
              </div>
            )}
          </div>
        </div>
    </HomePageContainer>
  );
}
