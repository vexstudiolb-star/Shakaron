"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

export function HtmlAttributes({
  locale,
  dir,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.body.classList.add("motion-ready");
  }, [locale, dir]);

  return null;
}
