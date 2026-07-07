"use client";

import dynamic from "next/dynamic";

function SceneLoading() {
  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-sm border border-gold/10 bg-charcoal-soft lg:min-h-[520px]">
      <div className="h-8 w-8 animate-pulse rounded-full border border-gold/30" />
    </div>
  );
}

export const JewelryScene = dynamic(
  () => import("./scene/JewelryScene").then((mod) => ({ default: mod.JewelryScene })),
  {
    ssr: false,
    loading: SceneLoading,
  }
);
