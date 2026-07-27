import { NextResponse } from "next/server";
import { requireAdminClient } from "@/lib/admin/require-admin";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const { id } = await params;
  const body = await request.json();
  const { data, error } = await result.supabase
    .from("homepage_sections")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ section: data });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const result = await requireAdminClient();
  if (result.error) return result.error;

  const { id } = await params;
  const { error } = await result.supabase.from("homepage_sections").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
