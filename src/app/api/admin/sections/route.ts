import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/admin/require-admin";

export async function GET() {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const { data, error } = await result.supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sections: data });
}

export async function POST(request: Request) {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const body = await request.json();
  const { data, error } = await result.supabase
    .from("homepage_sections")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section: data });
}
