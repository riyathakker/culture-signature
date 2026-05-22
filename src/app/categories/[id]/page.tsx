"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterDrawer } from "@/components/shop/FilterDrawer";
import { ShopControls } from "@/components/shop/ShopControls";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HomePageContainer } from "@/components/common/HomePageContainer";
import { ROUTES } from "@/constants/routes";
import { useCategoryStore } from "@/store/categoryStore";

export default function CategoryPage() {
  const { id } = useParams();
  const { categories, fetchCategories } = useCategoryStore();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCategories();
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentCat = categories.find((c: any) => c.id === id);
        setCategory(currentCat);

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

  const searchParams = useSearchParams();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

  const filteredProducts = products.filter((p) => Number(p.price) >= minPrice && Number(p.price) <= maxPrice);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "popularity") return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    return 0;
  });

  return (
    <HomePageContainer
      label={[{ label: "Categories", href: ROUTES.CATEGORIES }, { label: category?.name }]}
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-muted-foreground/10 pb-6">
            <div className="flex items-center gap-4 flex-row">
              <FilterDrawer />
              <p className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Showing {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            <ShopControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {loading ? (
            <div className="grid-gallery">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-32 text-center space-y-6">
              <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif italic text-muted-foreground">?</span>
              </div>
              <p className="muted-italic text-xl">No masterpieces found in this curation yet.</p>
              <button
                onClick={() => window.location.href = "/collections"}
                className="text-primary hover:text-primary/70 transition-colors text-sm uppercase tracking-[0.2em] font-bold border-b border-primary/30 pb-1 cursor-pointer"
              >
                Explore All Collections
              </button>
            </div>
          ) : (
            <div className="grid-gallery gap-x-8 gap-y-12 animate-in fade-in duration-1000">
              {sortedProducts.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </HomePageContainer>
  );
}
