"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tag } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useTranslation } from "@/context/TranslationContext";
import { ROUTES } from "@/constants/routes";
import type { Product, Category } from "@/types";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    // Nothing to fetch — the render below already hides stale results
    // whenever `trimmed` is empty, so no state reset is needed here.
    if (!trimmed) return;

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setTotal(data.total || 0);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, open]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setQuery("");
    onOpenChange(next);
  };

  const go = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const trimmed = query.trim();

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange} title={t("search.label")} description={t("search.placeholder")}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={t("search.placeholder")}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!trimmed ? (
            <CommandEmpty>{t("search.typeToSearch")}</CommandEmpty>
          ) : !loading && products.length === 0 && categories.length === 0 ? (
            <CommandEmpty>{t("search.noResults").replace("{query}", trimmed)}</CommandEmpty>
          ) : (
            <>
              {categories.length > 0 && (
                <CommandGroup heading={t("search.categories")}>
                  {categories.map((c) => (
                    <CommandItem key={c.id} value={`category-${c.id}`} onSelect={() => go(`/categories/${c.id}`)}>
                      <Tag className="opacity-60" />
                      <span>{c.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {products.length > 0 && (
                <CommandGroup heading={t("search.products")}>
                  {products.map((p) => (
                    <CommandItem key={p.id} value={`product-${p.id}`} onSelect={() => go(`/product/${p.id}`)}>
                      <div className="w-8 h-8 shrink-0 rounded overflow-hidden bg-secondary/30 relative">
                        {p.images?.[0] && (
                          <Image src={p.images[0]} alt={p.name} fill sizes="32px" className="object-cover" />
                        )}
                      </div>
                      <span className="truncate">{p.name}</span>
                    </CommandItem>
                  ))}
                  {total > products.length && (
                    <CommandItem
                      value="view-all"
                      onSelect={() => go(`${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`)}
                      className="text-primary font-medium justify-center"
                    >
                      {t("search.viewAllResults").replace("{count}", String(total))}
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
