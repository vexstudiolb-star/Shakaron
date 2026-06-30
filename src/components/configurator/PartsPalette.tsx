"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import {
  jewelryParts,
  partsByCategory,
  type PartDefinition,
} from "@/lib/configurator/parts-catalog";
import type { PartCategory } from "@/lib/configurator/types";
import { CategoryGroup } from "./ui/CategoryGroup";
import { DraggablePartCard } from "./ui/DraggablePartCard";

const categoryOrder: PartCategory[] = ["chain", "pendant", "ring", "charm", "connector"];

export function PartsPalette() {
  const { dict } = useLocale();
  const t = dict.configurator;
  const { addPart } = useConfigurator();

  function labelFor(part: PartDefinition) {
    return t.parts[part.labelKey as keyof typeof t.parts];
  }

  return (
    <aside
      className="flex h-full flex-col border-e border-gold/10 bg-charcoal/60 backdrop-blur-md"
      aria-label={t.partsPalette}
    >
      <header className="border-b border-gold/10 px-5 py-6">
        <p className="text-[0.6rem] font-light uppercase tracking-[0.3em] text-gold-muted">
          {t.dragParts}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-ivory">{t.partsLibrary}</h2>
        <p className="mt-2 text-xs font-light leading-relaxed text-cream/45">{t.dragHint}</p>
        <Link
          href="/models/jewelry/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[0.65rem] font-light uppercase tracking-[0.15em] text-gold-light transition-colors hover:text-cream"
        >
          <Download size={12} strokeWidth={1.5} />
          {t.downloadAll}
        </Link>
      </header>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-5 hide-scrollbar">
        {categoryOrder.map((category) => {
          const parts = partsByCategory[category];
          if (!parts?.length) return null;
          return (
            <CategoryGroup
              key={category}
              title={t.categories[category as keyof typeof t.categories]}
            >
              {parts.map((part) => (
                <DraggablePartCard
                  key={part.id}
                  part={part}
                  label={labelFor(part)}
                  onAdd={() => addPart(part.id)}
                />
              ))}
            </CategoryGroup>
          );
        })}
      </div>

      <footer className="border-t border-gold/10 px-5 py-4 text-[0.6rem] font-light text-cream/35">
        {jewelryParts.length} {t.shapesAvailable} · GLB in{" "}
        <code className="text-cream/50">public/models/jewelry/</code>
      </footer>
    </aside>
  );
}
