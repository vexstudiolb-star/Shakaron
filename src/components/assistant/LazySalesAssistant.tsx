"use client";

import dynamic from "next/dynamic";

const SalesAssistant = dynamic(
  () =>
    import("@/components/assistant/SalesAssistant").then((m) => m.SalesAssistant),
  { ssr: false, loading: () => null }
);

export function LazySalesAssistant() {
  return <SalesAssistant />;
}
