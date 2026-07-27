"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Camera, ImagePlus, Loader2, Upload } from "lucide-react";

type UploadedResult = {
  url: string;
  key: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
};

type ImageUploaderProps = {
  folder?: string;
  label?: string;
  onUploaded: (result: UploadedResult) => void;
  currentUrl?: string | null;
  className?: string;
};

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

export function ImageUploader({
  folder = "products",
  label = "Upload image",
  onUploaded,
  currentUrl,
  className = "",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  useEffect(() => {
    setPreview(currentUrl ?? null);
  }, [currentUrl]);

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1.2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        });

        const prepared = compressed.size < file.size ? compressed : file;
        const mimeType = prepared.type || "image/webp";
        const dims = await getImageDimensions(prepared).catch(() => undefined);

        const body = new FormData();
        const blobName = prepared.name?.replace(/\.[^.]+$/, ".webp") || "image.webp";
        body.append("file", prepared, blobName);
        body.append("folder", folder);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });

        const payload = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          throw new Error(payload.error ?? "Upload to Cloudflare R2 failed");
        }

        const result: UploadedResult = {
          url: payload.url as string,
          key: payload.key as string,
          fileName: (payload.fileName as string) || blobName,
          mimeType: (payload.mimeType as string) || mimeType,
          sizeBytes: (payload.sizeBytes as number) || prepared.size,
          width: dims?.width,
          height: dims?.height,
        };

        setPreview(result.url);
        onUploaded(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploaded]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-cream/60">{label}</p>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-charcoal/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="aspect-[4/3] w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-gold/30 bg-charcoal/30">
          <ImagePlus className="h-10 w-10 text-cream/30" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
        disabled={uploading}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-medium text-charcoal disabled:opacity-50 sm:flex-none sm:py-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Choose photo"}
        </button>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gold/40 px-4 py-3 text-sm text-cream sm:flex-none sm:py-2 md:hidden"
        >
          <Camera className="h-4 w-4" />
          Camera
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <p className="text-xs text-cream/40">
        Uploads go to Cloudflare R2 and are saved on the product in Supabase.
      </p>
    </div>
  );
}
