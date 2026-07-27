"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { MediaAssetRow } from "@/lib/admin/types";

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const body = await res.json();
    setAssets(body.assets ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-2xl text-gold">Media Library</h1>
      <p className="mt-1 text-sm text-cream/50">{assets.length} uploads</p>

      <div className="mt-6 max-w-sm">
        <ImageUploader folder="uploads" label="Upload new image" onUploaded={() => void load()} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {assets.map((a) => (
          <div
            key={a.id}
            className="overflow-hidden rounded-xl border border-gold/15 bg-cream/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.url}
              alt={a.alt_en || a.file_name}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
            <div className="p-2">
              <p className="truncate text-[10px] text-cream/50">{a.file_name}</p>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(a.url)}
                className="mt-1 text-[10px] text-gold hover:underline"
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
