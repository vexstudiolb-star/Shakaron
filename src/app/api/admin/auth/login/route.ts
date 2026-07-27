import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminUser } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add keys to .env.local (and Vercel env)." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] =
    [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options: options ?? {} });
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore if called outside a mutable cookie context
          }
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    const allowed = (process.env.ADMIN_ALLOWED_EMAILS ?? "").trim();
    return NextResponse.json(
      {
        error: allowed
          ? "This account is not on the admin allowlist (ADMIN_ALLOWED_EMAILS)."
          : "ADMIN_ALLOWED_EMAILS is empty. Add your email to .env.local / Vercel env, then restart.",
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ user: { email: data.user.email }, ok: true });
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export async function DELETE() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: true });
  }

  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: Record<string, unknown> }[] =
    [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options: options ?? {} });
          try {
            cookieStore.set(name, value, options);
          } catch {
            // ignore
          }
        });
      },
    },
  });

  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}
