"use client";

import { useLayoutEffect } from "react";
import type { Locale } from "@/i18n/config";

export function HtmlAttributes({
  locale,
  dir,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
}) {
  // useLayoutEffect runs before paint so EN never flashes as RTL after switching
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    root.setAttribute("dir", dir);
    root.setAttribute("lang", locale);
    document.body.classList.add("motion-ready");
  }, [locale, dir]);

  return null;
}
