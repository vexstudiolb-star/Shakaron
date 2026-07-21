"use client";

import { useCallback, useEffect, useState } from "react";
import { GripVertical, Loader2, Plus } from "lucide-react";
import type { HomepageSectionRow } from "@/lib/admin/types";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<HomepageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    section_type: "content",
    title_en: "",
    title_ar: "",
    eyebrow_en: "",
    eyebrow_ar: "",
    description_en: "",
    description_ar: "",
    is_enabled: true,
    sort_order: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/sections");
    const body = await res.json();
    setSections(body.sections ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (id: string, is_enabled: boolean) => {
    await fetch(`/api/admin/sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_enabled }),
    });
    void load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const other = index + direction;
    if (other < 0 || other >= sections.length) return;

    const a = sections[index];
    const b = sections[other];

    await Promise.all([
      fetch(`/api/admin/sections/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: b.sort_order }),
      }),
      fetch(`/api/admin/sections/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: a.sort_order }),
      }),
    ]);

    void load();
  };

  const addSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sort_order: sections.length + 1 }),
    });
    setSaving(false);
    setShowForm(false);
    void load();
  };

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-charcoal px-3 py-2 text-sm text-cream outline-none focus:border-gold/50";

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
        <div>
          <h1 className="font-serif text-2xl text-gold">Homepage Sections</h1>
          <p className="mt-1 text-sm text-cream/50">Toggle visibility and reorder</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-charcoal"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      </div>

      {showForm ? (
        <form onSubmit={addSection} className="mt-6 space-y-3 rounded-2xl border border-gold/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
            />
            <select
              value={form.section_type}
              onChange={(e) => setForm((f) => ({ ...f, section_type: e.target.value }))}
              className={inputClass}
            >
              <option value="hero">hero</option>
              <option value="collection">collection</option>
              <option value="content">content</option>
            </select>
            <input
              required
              placeholder="Title (EN)"
              value={form.title_en}
              onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              placeholder="Title (AR)"
              dir="rtl"
              value={form.title_ar}
              onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-charcoal"
          >
            {saving ? "Saving…" : "Create section"}
          </button>
        </form>
      ) : null}

      <ul className="mt-6 space-y-2">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-2 rounded-xl border border-gold/15 bg-cream/5 px-3 py-3"
          >
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => void move(i, -1)}
                disabled={i === 0}
                className="text-cream/30 hover:text-gold disabled:opacity-20"
                aria-label="Move up"
              >
                <GripVertical className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => void move(i, 1)}
                disabled={i === sections.length - 1}
                className="text-cream/30 hover:text-gold disabled:opacity-20"
                aria-label="Move down"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-cream">{s.title_en}</p>
              <p className="text-xs text-cream/50">
                {s.slug} · {s.section_type} · order {s.sort_order}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-cream/60">
              <input
                type="checkbox"
                checked={s.is_enabled}
                onChange={(e) => void toggle(s.id, e.target.checked)}
                className="accent-gold"
              />
              On
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
