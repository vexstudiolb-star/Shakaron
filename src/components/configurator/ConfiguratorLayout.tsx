"use client";

import type { ReactNode } from "react";
import { ConfiguratorProvider } from "@/contexts/ConfiguratorContext";
import { ConfiguratorDndProvider } from "./ConfiguratorDndProvider";
import { ConfiguratorErrorBoundary } from "./ConfiguratorErrorBoundary";
import { PartsPalette } from "./PartsPalette";
import { PersonalizationSidebar } from "./PersonalizationSidebar";
import { JewelryScene } from "./scene";

type ConfiguratorLayoutProps = {
  header?: ReactNode;
};

export function ConfiguratorLayout({ header }: ConfiguratorLayoutProps) {
  return (
    <ConfiguratorProvider>
      <ConfiguratorDndProvider>
        <div className="flex min-h-[calc(100dvh-5rem)] flex-col bg-charcoal lg:min-h-[calc(100dvh-6rem)]">
          {header}

          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(360px,50vh)_auto_auto] lg:grid-cols-[minmax(260px,300px)_1fr_minmax(260px,300px)] lg:grid-rows-1">
            <div className="order-2 min-h-0 lg:order-1">
              <PartsPalette />
            </div>

            <main className="order-1 min-h-[360px] p-3 lg:order-2 lg:min-h-[480px] lg:p-4">
              <ConfiguratorErrorBoundary>
                <JewelryScene />
              </ConfiguratorErrorBoundary>
            </main>

            <div className="order-3 min-h-0">
              <PersonalizationSidebar />
            </div>
          </div>
        </div>
      </ConfiguratorDndProvider>
    </ConfiguratorProvider>
  );
}
