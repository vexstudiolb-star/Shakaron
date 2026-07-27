import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Prefer cookie, then Accept-Language quality values (do not match bare "ar" substring). */
export function resolvePreferredLocale(
  cookieHeader: string | null,
  acceptLanguage: string | null
): Locale {
  const fromCookie = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1]
    ?.trim();

  if (fromCookie && isLocale(fromCookie)) {
    return fromCookie;
  }

  if (!acceptLanguage?.trim()) {
    return defaultLocale;
  }

  const ranked = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tagPart, ...params] = entry.trim().split(";");
      const tag = tagPart.trim().toLowerCase();
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === "ar" || tag.startsWith("ar-")) return "ar";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }

  return defaultLocale;
}

export function buildLocaleCookie(locale: Locale) {
  const maxAge = 60 * 60 * 24 * 365;
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
