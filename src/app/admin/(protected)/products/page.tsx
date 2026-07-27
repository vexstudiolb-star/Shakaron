"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Plus, Pencil } from "lucide-react";
import type { ProductRow } from "@/lib/admin/types";

type ProductWithCategory = ProductRow & {
  collection_categories?: { slug: string; name_en: string } | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load products");
      setLoading(false);
      return;
    }
    setProducts(body.products ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (id: string, is_active: boolean) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, is_active } : p)));
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active }),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-gold">Products</h1>
          <p className="mt-1 text-sm text-cream/50">{products.length} items</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-charcoal"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {error ? <p className="mt-4 text-red-400">{error}</p> : null}

      <ul className="mt-6 space-y-3">
        {products.map((p) => {
          const catSlug = p.collection_categories?.slug;
          const liveHref =
            p.is_active && catSlug ? `/en/collections/${catSlug}/${p.slug}` : null;

          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-gold/15 bg-cream/5 p-3"
            >
              {p.product_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.product_image_url}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-charcoal text-xs text-cream/30">
                  No img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-cream">{p.name_en}</p>
                <p className="truncate text-xs text-cream/50">
                  {p.collection_categories?.name_en ?? "—"} · {p.slug}
                </p>
              </div>
              <label className="flex shrink-0 items-center gap-2 text-xs text-cream/60">
                <input
                  type="checkbox"
                  checked={p.is_active}
                  onChange={(e) => void toggleActive(p.id, e.target.checked)}
                  className="accent-gold"
                />
                Live
              </label>
              {liveHref ? (
                <Link
                  href={liveHref}
                  target="_blank"
                  className="shrink-0 rounded-lg p-2 text-cream/60 hover:bg-gold/10 hover:text-gold"
                  title="View on website"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href={`/admin/products/${p.id}`}
                className="shrink-0 rounded-lg p-2 text-cream/60 hover:bg-gold/10 hover:text-gold"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ul>

      {products.length === 0 && !error ? (
        <p className="mt-8 text-center text-cream/40">No products yet. Add your first one.</p>
      ) : null}
    </div>
  );
}
