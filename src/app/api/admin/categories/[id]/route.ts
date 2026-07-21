import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) return null;
  return createServiceSupabaseClient();
}

export async function PATCH(request: Request, { params }: Ctx) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabase
    .from("collection_categories")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("collection_categories").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
