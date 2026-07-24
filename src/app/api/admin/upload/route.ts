import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { buildR2Key, uploadToR2 } from "@/lib/r2/client";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "products");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 8 MB." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = file.type.includes("webp")
      ? "webp"
      : file.type.includes("png")
        ? "png"
        : file.type.includes("jpeg") || file.type.includes("jpg")
          ? "jpg"
          : "bin";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    const key = buildR2Key(folder, `${baseName}.${ext}`);
    const publicUrl = await uploadToR2({
      key,
      body: bytes,
      contentType: file.type || "application/octet-stream",
    });

    const supabase = createServiceSupabaseClient();
    await supabase.from("media_assets").insert({
      file_name: file.name,
      url: publicUrl,
      r2_key: key,
      mime_type: file.type,
      size_bytes: file.size,
    });

    return NextResponse.json({
      url: publicUrl,
      key,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
