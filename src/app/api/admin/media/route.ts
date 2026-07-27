import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/admin/require-admin";

export async function POST(request: Request) {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const body = (await request.json()) as {
    file_name: string;
    url: string;
    r2_key: string;
    mime_type?: string;
    size_bytes?: number;
    width?: number;
    height?: number;
    alt_en?: string;
    alt_ar?: string;
  };

  const { data, error } = await result.supabase.from("media_assets").insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ asset: data });
}

export async function GET() {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const { data, error } = await result.supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assets: data });
}
