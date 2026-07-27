"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { localeNavHref, siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

function useShouldLoadHeroVideo() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection?.saveData);

    const allow = mq.matches && !reduced.matches && !saveData;
    if (!allow) return;

    let cancelled = false;
    const enable = () => {
      if (!cancelled) setLoad(true);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | null = null;
    let timeoutId: number | null = null;

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 400);
    }

    return () => {
      cancelled = true;
      if (idleId != null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return load;
}

export function Hero() {
  const { locale, dict } = useLocale();
  const loadVideo = useShouldLoadHeroVideo();

  return (
    <section
      className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden md:min-h-[600px]"
      aria-label="Hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {/* Lightweight poster first — video only on desktop after idle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={siteConfig.assets.heroPoster}
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        {loadVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={siteConfig.assets.heroPoster}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={siteConfig.assets.heroVideo} type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="mb-6 text-[0.65rem] font-light uppercase tracking-[0.35em] text-gold-light animate-[fadeUp_0.7s_ease_both]">
          {dict.hero.eyebrow}
        </p>

        <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-8xl animate-[fadeUp_0.7s_ease_0.1s_both]">
          {dict.hero.titleLine1}
          <br />
          <em className="not-italic text-gold-light">{dict.hero.titleAccent}</em>
        </h1>

        <p className="mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-cream/70 md:text-base animate-[fadeUp_0.7s_ease_0.2s_both]">
          {dict.hero.subtitle}
        </p>

        <div className="mt-12 animate-[fadeUp_0.7s_ease_0.3s_both]">
          <Link
            href={localeNavHref(locale, "newCollection")}
            className="group inline-flex items-center gap-3 border border-gold/40 bg-gold/10 px-10 py-4 text-[0.65rem] font-light uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-all duration-700 hover:border-gold hover:bg-gold/20"
          >
            {dict.hero.explore}
            <ChevronDown
              size={14}
              strokeWidth={1}
              className="transition-transform duration-500 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-10 start-1/2 z-10 hidden -translate-x-1/2 md:block rtl:translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-cream/40">
            {dict.hero.scroll}
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
