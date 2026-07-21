"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { CollectionCategoryRow, ProductRow } from "@/lib/admin/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Props = { params: Promise<{ id: string }> };

export default function ProductFormPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(true);
  const [categories, setCategories] = useState<CollectionCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    category_id: "",
    brand_line_en: "Shakaron",
    brand_line_ar: "شاكارون",
    name_en: "",
    name_ar: "",
    price_label_en: "Price on request",
    price_label_ar: "السعر عند الطلب",
    product_image_url: "",
    worn_image_url: "",
    tags: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    void params.then(({ id: routeId }) => {
      setId(routeId);
      setIsNew(routeId === "new");
    });
  }, [params]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const catRes = await fetch("/api/admin/categories");
    const catBody = await catRes.json();
    setCategories(catBody.categories ?? []);

    if (id !== "new") {
      const res = await fetch(`/api/admin/products/${id}`);
      const body = await res.json();
      if (res.ok && body.product) {
        const p = body.product as ProductRow;
        setForm({
          slug: p.slug,
          category_id: p.category_id,
          brand_line_en: p.brand_line_en,
          brand_line_ar: p.brand_line_ar,
          name_en: p.name_en,
          name_ar: p.name_ar,
          price_label_en: p.price_label_en,
          price_label_ar: p.price_label_ar,
          product_image_url: p.product_image_url ?? "",
          worn_image_url: p.worn_image_url ?? "",
          tags: (p.tags ?? []).join(", "),
          sort_order: p.sort_order,
          is_active: p.is_active,
        });
      }
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const set = (key: keyof typeof form, value: string | number | boolean) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name_en" && isNew) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      product_image_url: form.product_image_url || null,
      worn_image_url: form.worn_image_url || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sort_order: Number(form.sort_order),
    };

    const url = isNew ? "/api/admin/products" : `/api/admin/products/${id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(body.error ?? "Save failed");
      return;
    }

    if (isNew && body.product?.id) {
      router.replace(`/admin/products/${body.product.id}`);
    } else {
      router.push("/admin/products");
    }
    router.refresh();
  };

  const remove = async () => {
    if (!id || isNew || !confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  };

  if (loading || !id) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2.5 text-sm text-cream outline-none focus:border-gold/50";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-2xl text-gold">{isNew ? "New product" : "Edit product"}</h1>

      <form onSubmit={save} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-cream/50">Name (EN)</span>
            <input
              required
              value={form.name_en}
              onChange={(e) => set("name_en", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-cream/50">Name (AR)</span>
            <input
              required
              dir="rtl"
              value={form.name_ar}
              onChange={(e) => set("name_ar", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-cream/50">Slug</span>
            <input
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-cream/50">Category</span>
            <select
              required
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className={inputClass}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-cream/50">Price label (EN)</span>
            <input
              value={form.price_label_en}
              onChange={(e) => set("price_label_en", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-cream/50">Price label (AR)</span>
            <input
              dir="rtl"
              value={form.price_label_ar}
              onChange={(e) => set("price_label_ar", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-cream/50">Tags (comma-separated)</span>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="ring, gold, under-1g"
              className={inputClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-cream/50">Sort order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="accent-gold"
            />
            Visible on site
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUploader
            folder="products"
            label="Product image"
            currentUrl={form.product_image_url}
            onUploaded={(r) => set("product_image_url", r.url)}
          />
          <ImageUploader
            folder="products/worn"
            label="Worn / model image"
            currentUrl={form.worn_image_url}
            onUploaded={(r) => set("worn_image_url", r.url)}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-medium text-charcoal disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save product
          </button>
          {!isNew ? (
            <button
              type="button"
              onClick={() => void remove()}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 text-sm text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
