"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  discount: number;
  images: string[];
  category: { id: string; name: string } | null;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_KEY = "cs_recent_searches";
const MAX_RECENT = 6;

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}

function saveRecent(query: string) {
  const prev = getRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

function removeRecent(query: string) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter((q) => q !== query)));
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const uniqueCategories = Array.from(
    new Map(results.filter((r) => r.category).map((r) => [r.category!.id, r.category!])).values()
  ).slice(0, 4);

  const topProducts = results.slice(0, 5);

  const allNavigable = [
    ...uniqueCategories.map((c) => ({ type: "category" as const, id: c.id, label: c.name })),
    ...topProducts.map((p) => ({ type: "product" as const, id: p.id, label: p.name })),
  ];

  const handleNavigate = (item: typeof allNavigable[number]) => {
    saveRecent(query.trim() || item.label);
    setRecent(getRecent());
    if (item.type === "category") router.push(`/categories/${item.id}`);
    else router.push(`/product/${item.id}`);
    onClose();
  };

  const handleSubmit = (q = query) => {
    if (!q.trim()) return;
    saveRecent(q.trim());
    router.push(`/collections?search=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allNavigable.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && allNavigable[activeIdx]) handleNavigate(allNavigable[activeIdx]);
      else handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-[100px] md:top-[160px] left-0 right-0 z-[46] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-background border border-border/60 rounded-xl shadow-2xl overflow-hidden">

            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Loading */}
              {loading && (
                <div className="py-6 flex justify-center">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}

              {/* Results */}
              {!loading && query.trim() && results.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground italic">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!loading && results.length > 0 && (
                <>
                  {/* Category shortcuts */}
                  {uniqueCategories.length > 0 && (
                    <div className="px-4 pt-4 pb-2">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {uniqueCategories.map((cat, i) => {
                          const navIdx = i;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleNavigate({ type: "category", id: cat.id, label: cat.name })}
                              className={cn(
                                "flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border transition-colors",
                                activeIdx === navIdx
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border/50 hover:border-primary/50 hover:bg-secondary/50"
                              )}
                            >
                              {cat.name} <ArrowUpRight className="w-3 h-3" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Product results */}
                  <div className="px-2 py-2">
                    {topProducts.map((product, i) => {
                      const navIdx = uniqueCategories.length + i;
                      const finalPrice = product.price - (product.discount || 0);
                      return (
                        <button
                          key={product.id}
                          onClick={() => handleNavigate({ type: "product", id: product.id, label: product.name })}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                            activeIdx === navIdx ? "bg-secondary" : "hover:bg-secondary/50"
                          )}
                        >
                          <div className="w-10 h-12 rounded-md overflow-hidden bg-secondary/30 flex-shrink-0 relative">
                            {product.images?.[0] && (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category?.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold">₹{finalPrice.toLocaleString()}</p>
                            {product.discount > 0 && (
                              <p className="text-[10px] text-muted-foreground line-through">₹{product.price.toLocaleString()}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* See all results */}
                  {results.length >= 5 && (
                    <button
                      onClick={() => handleSubmit()}
                      className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-secondary/30 transition-colors border-t border-border/30"
                    >
                      See all results for &ldquo;{query}&rdquo;
                    </button>
                  )}
                </>
              )}

              {/* Empty state — show recent searches */}
              {!query.trim() && (
                <div className="px-4 py-4 space-y-4">
                  {recent.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Recent
                      </p>
                      <div className="space-y-0.5">
                        {recent.map((q) => (
                          <div key={q} className="flex items-center justify-between group">
                            <button
                              onClick={() => { setQuery(q); }}
                              className="flex-1 text-left text-sm py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors"
                            >
                              {q}
                            </button>
                            <button
                              onClick={() => { removeRecent(q); setRecent(getRecent()); }}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Popular
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Rings", "Necklaces", "Bracelets", "Earrings", "Limited Drop"].map((term) => (
                        <button
                          key={term}
                          onClick={() => { setQuery(term); }}
                          className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-border/50 hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
