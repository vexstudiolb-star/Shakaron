import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(user.email.toLowerCase());
}

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return { supabase: null, user: null as User | null, isAdmin: false };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user, isAdmin: isAdminUser(user) };
}
