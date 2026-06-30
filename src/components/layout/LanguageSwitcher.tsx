"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  fixed?: boolean;
};

export function LanguageSwitcher({ className, fixed = false }: LanguageSwitcherProps) {
  const { locale, dict } = useLocale();
  const pathname = usePathname();

  function getLocalizedPath(target: Locale) {
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = target;
      return segments.join("/") || `/${target}`;
    }
    return `/${target}`;
  }

  return (
    <div
      className={cn(
        "lang-switcher flex items-center gap-0.5 rounded-full border border-gold/30 bg-charcoal/90 p-0.5 shadow-lg shadow-black/30 backdrop-blur-md",
        fixed && "fixed top-5 end-5 z-[200]",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => {
        const isActive = locale === code;
        return (
          <Link
            key={code}
            href={getLocalizedPath(code)}
            className={cn(
              "min-w-[2.75rem] rounded-full px-3 py-2 text-center text-[0.65rem] font-medium uppercase tracking-wider transition-all duration-300",
              isActive
                ? "bg-gold/30 text-cream"
                : "text-cream/60 hover:bg-gold/15 hover:text-cream"
            )}
            aria-current={isActive ? "true" : undefined}
            aria-label={
              code === "en" ? dict.common.switchToEn : dict.common.switchToAr
            }
          >
            {dict.language[code]}
          </Link>
        );
      })}
    </div>
  );
}
