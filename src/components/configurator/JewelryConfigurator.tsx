"use client";

import { ConfiguratorLayout } from "./ConfiguratorLayout";
import { useLocale } from "@/contexts/LocaleContext";

export function JewelryConfigurator() {
  const { dict } = useLocale();

  return (
    <ConfiguratorLayout
      header={
        <div className="border-b border-gold/10 px-6 py-5 text-center lg:px-10 lg:py-6">
          <p className="text-[0.6rem] font-light uppercase tracking-[0.35em] text-gold-light">
            {dict.configurator.eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light text-ivory md:text-4xl">
            {dict.configurator.title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm font-light text-cream/50">
            {dict.configurator.subtitle}
          </p>
        </div>
      }
    />
  );
}
