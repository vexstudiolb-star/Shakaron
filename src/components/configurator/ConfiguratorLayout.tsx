"use client";

import { ConfiguratorProvider } from "@/contexts/ConfiguratorContext";
import { ConfiguratorErrorBoundary } from "./ConfiguratorErrorBoundary";
import { StudioShell } from "./studio/StudioShell";

export function ConfiguratorLayout() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorErrorBoundary>
        <StudioShell />
      </ConfiguratorErrorBoundary>
    </ConfiguratorProvider>
  );
}
