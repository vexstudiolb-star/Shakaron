import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Verify admin session, then return service-role client (bypasses RLS). */
export async function requireAdminClient(): Promise<
  { supabase: SupabaseClient; error?: undefined } | { supabase?: undefined; error: NextResponse }
> {
  const { isAdmin } = await getAdminSession();
  if (!isAdmin) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    return { supabase: createServiceSupabaseClient() };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Supabase service role is not configured.";
    return { error: NextResponse.json({ error: message }, { status: 500 }) };
  }
}
