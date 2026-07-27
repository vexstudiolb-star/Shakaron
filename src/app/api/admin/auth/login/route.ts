import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminUser } from "@/lib/admin/auth";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

function applyCookies(response: NextResponse, list: CookieToSet[]) {
  for (const { name, value, options } of list) {
    const opts = options ?? {};
    response.cookies.set(name, value, {
      path: typeof opts.path === "string" ? opts.path : "/",
      domain: typeof opts.domain === "string" ? opts.domain : undefined,
      maxAge: typeof opts.maxAge === "number" ? opts.maxAge : undefined,
      expires: opts.expires instanceof Date ? opts.expires : undefined,
      httpOnly: opts.httpOnly !== false,
      secure: process.env.NODE_ENV === "production" ? true : Boolean(opts.secure),
      sameSite:
        opts.sameSite === "none" || opts.sameSite === "strict" || opts.sameSite === "lax"
          ? opts.sameSite
          : "lax",
    });
  }
}

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
  const pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options: options as Record<string, unknown> });
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Route handler will also set cookies on the response below
          }
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

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

  const response = NextResponse.json({
    ok: true,
    user: { email: data.user?.email ?? null },
    redirectTo: "/admin",
  });
  applyCookies(response, pendingCookies);
  return response;
}

export async function DELETE() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: true });
  }

  const cookieStore = await cookies();
  const pendingCookies: CookieToSet[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          pendingCookies.push({ name, value, options: options as Record<string, unknown> });
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

  const response = NextResponse.json({ ok: true, redirectTo: "/admin/login" });
  applyCookies(response, pendingCookies);
  return response;
}
