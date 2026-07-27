"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { CollectionCategoryRow } from "@/lib/admin/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CollectionCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CollectionCategoryRow | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: "",
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    hero_image_url: "",
    sort_order: 0,
    is_active: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const body = await res.json();
    setCategories(body.categories ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => {
    setForm({
      slug: "",
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      hero_image_url: "",
      sort_order: categories.length,
      is_active: true,
    });
    setEditing("new");
    setError(null);
  };

  const openEdit = (c: CollectionCategoryRow) => {
    setForm({
      slug: c.slug,
      name_en: c.name_en,
      name_ar: c.name_ar,
      description_en: c.description_en,
      description_ar: c.description_ar,
      hero_image_url: c.hero_image_url ?? "",
      sort_order: c.sort_order,
      is_active: c.is_active,
    });
    setEditing(c);
    setError(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      hero_image_url: form.hero_image_url || null,
      sort_order: Number(form.sort_order),
    };

    const isNew = editing === "new";
    const url = isNew ? "/api/admin/categories" : `/api/admin/categories/${(editing as CollectionCategoryRow).id}`;
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

    setEditing(null);
    void load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category? Products must be moved first.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      alert(body.error ?? "Could not delete");
      return;
    }
    void load();
  };

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2.5 text-sm text-cream outline-none focus:border-gold/50";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-gold">Categories</h1>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-charcoal"
        >
          <Plus className="h-4 w-4" />
          Add category
        </button>
      </div>

      {editing ? (
        <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-gold/20 p-4">
          <h2 className="font-medium text-cream">
            {editing === "new" ? "New category" : "Edit category"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs text-cream/50">Name (EN)</span>
              <input
                required
                value={form.name_en}
                onChange={(e) => {
                  const name_en = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name_en,
                    slug: editing === "new" ? slugify(name_en) : f.slug,
                  }));
                }}
                className={inputClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-cream/50">Name (AR)</span>
              <input
                required
                dir="rtl"
                value={form.name_ar}
                onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-cream/50">Slug</span>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className={inputClass}
              />
            </label>
            <div className="sm:col-span-2">
              <ImageUploader
                folder="categories"
                label="Hero image (Cloudflare R2)"
                currentUrl={form.hero_image_url || null}
                onUploaded={(r) => setForm((f) => ({ ...f, hero_image_url: r.url }))}
              />
            </div>
            <label className="block space-y-1 sm:col-span-2">
              <span className="text-xs text-cream/50">Description (EN)</span>
              <textarea
                rows={2}
                value={form.description_en}
                onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 sm:col-span-2">
              <span className="text-xs text-cream/50">Description (AR)</span>
              <textarea
                rows={2}
                dir="rtl"
                value={form.description_ar}
                onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-cream/50">Sort order</span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className={inputClass}
              />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm text-cream/70">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                className="accent-gold"
              />
              Visible on site
            </label>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-charcoal disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-gold/30 px-4 py-2 text-sm text-cream/70"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-xl border border-gold/15 bg-cream/5 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-cream">{c.name_en}</p>
              <p className="text-xs text-cream/50">{c.slug}</p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                c.is_active ? "bg-green-500/20 text-green-300" : "bg-cream/10 text-cream/40"
              }`}
            >
              {c.is_active ? "Active" : "Hidden"}
            </span>
            <button
              type="button"
              onClick={() => openEdit(c)}
              className="rounded-lg p-2 text-cream/60 hover:text-gold"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void remove(c.id)}
              className="text-xs text-red-400 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
