"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

const INTRO_KEY = "shakaron-intro-done";
const AUTO_SKIP_MS = 8000;

type SiteLoaderProps = {
  children: React.ReactNode;
};

export function SiteLoader({ children }: SiteLoaderProps) {
  const { dict } = useLocale();
  const pathname = usePathname();
  const skipIntro = pathname.includes("/configurator");
  const [showIntro, setShowIntro] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }

    videoRef.current?.pause();
    setShowIntro(false);
    document.body.classList.remove("intro-active");
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (skipIntro) return;

    let autoSkip: number | undefined;

    try {
      if (sessionStorage.getItem(INTRO_KEY) === "1") {
        doneRef.current = true;
        return;
      }
    } catch {
      /* ignore */
    }

    setShowIntro(true);
    document.body.classList.add("intro-active");
    document.body.style.overflow = "hidden";
    autoSkip = window.setTimeout(finishIntro, AUTO_SKIP_MS);

    return () => {
      if (autoSkip) window.clearTimeout(autoSkip);
      document.body.classList.remove("intro-active");
      document.body.style.overflow = "";
    };
  }, [finishIntro, skipIntro]);

  const handleVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video || doneRef.current) return;
    video.muted = true;
    video.play().catch(() => finishIntro());
  }, [finishIntro]);

  return (
    <>
      {children}

      {showIntro && !skipIntro && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.loading}
          onClick={finishIntro}
          className="fixed inset-0 z-[150] flex cursor-pointer items-center justify-center bg-black"
        >
          <video
            ref={videoRef}
            src={siteConfig.assets.logoVideo}
            playsInline
            muted
            autoPlay
            preload="auto"
            onLoadedData={handleVideoReady}
            onCanPlay={handleVideoReady}
            onEnded={finishIntro}
            onError={finishIntro}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-none h-full w-full object-contain"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finishIntro();
            }}
            className="absolute bottom-10 left-1/2 z-[160] -translate-x-1/2 cursor-pointer rounded-full border border-cream/30 bg-charcoal/80 px-8 py-3 text-[0.7rem] font-light uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold-light"
          >
            {dict.intro.skip}
          </button>
        </div>
      )}
    </>
  );
}
