import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

function getPreferredLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.includes("ar")) return "ar";
  return defaultLocale;
}

function getHostname(request: NextRequest) {
  const raw =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.hostname ||
    "";
  return raw.split(":")[0].toLowerCase();
}

/** admin.shakaronjewellery.com (and any admin.* host) → admin app only */
function isAdminHostname(hostname: string) {
  if (!hostname) return false;
  if (hostname === "admin.shakaronjewellery.com") return true;
  return hostname.startsWith("admin.");
}

async function refreshAdminSession(
  request: NextRequest,
  buildResponse: () => NextResponse
) {
  let response = buildResponse();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = buildResponse();
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            path: options?.path ?? "/",
            sameSite: options?.sameSite ?? "lax",
          });
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getHostname(request);

  // ── Admin subdomain (admin.shakaronjewellery.com) ─────────────────────
  // Visiting / was previously locale-redirected to /en (storefront).
  // Instead, rewrite into /admin/* and never apply locale redirects.
  if (isAdminHostname(hostname)) {
    let adminPath = pathname;

    if (pathname === "/" || pathname === "") {
      adminPath = "/admin";
    } else if (!pathname.startsWith("/admin")) {
      adminPath = `/admin${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = adminPath;

    return refreshAdminSession(request, () =>
      adminPath === pathname
        ? NextResponse.next({
            request: { headers: request.headers },
          })
        : NextResponse.rewrite(rewriteUrl)
    );
  }

  // /en/admin or /ar/admin → /admin on the main site
  for (const locale of locales) {
    if (pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${locale}`, "") || "/admin";
      return NextResponse.redirect(url);
    }
  }

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPath) {
    return refreshAdminSession(request, () =>
      NextResponse.next({
        request: { headers: request.headers },
      })
    );
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
