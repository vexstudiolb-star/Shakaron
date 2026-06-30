"use client";

import { Trash2 } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import { metalOptions, metalColors, partsById } from "@/lib/configurator/parts-catalog";
import { cn } from "@/lib/utils";
import { OptionButton } from "./ui/OptionButton";

const MAX_ENGRAVING_LENGTH = 24;

export function PersonalizationSidebar() {
  const { dict } = useLocale();
  const t = dict.configurator;
  const {
    placedParts,
    selectedInstanceId,
    activeMetal,
    engravingText,
    setMetal,
    setEngraving,
    selectPart,
    removePart,
    reset,
  } = useConfigurator();

  const selectedPart = placedParts.find((p) => p.instanceId === selectedInstanceId);

  function partLabel(partId: string) {
    const def = partsById[partId as keyof typeof partsById];
    if (!def) return partId;
    return t.parts[def.labelKey as keyof typeof t.parts];
  }

  return (
    <aside
      className="flex h-full flex-col border-s border-gold/10 bg-charcoal/60 backdrop-blur-md"
      aria-label={t.personalizationSidebar}
    >
      <header className="border-b border-gold/10 px-5 py-6">
        <p className="text-[0.6rem] font-light uppercase tracking-[0.3em] text-gold-muted">
          {t.personalize}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-ivory">{t.yourDesign}</h2>
      </header>

      <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6 hide-scrollbar">
        <section className="space-y-3">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.metal}
          </h3>
          <div className="flex flex-col gap-2">
            {metalOptions.map((option) => (
              <OptionButton
                key={option.id}
                label={
                  t.metals[option.labelKey as keyof typeof t.metals]
                }
                selected={activeMetal === option.id}
                onClick={() => setMetal(option.id)}
                swatchColor={metalColors[option.id]}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label
            htmlFor="engraving-text"
            className="block text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold"
          >
            {t.engravingLabel}
          </label>
          <input
            id="engraving-text"
            type="text"
            value={engravingText}
            onChange={(e) => setEngraving(e.target.value.slice(0, MAX_ENGRAVING_LENGTH))}
            placeholder={t.engravingPlaceholder}
            maxLength={MAX_ENGRAVING_LENGTH}
            className="w-full border-b border-cream/20 bg-transparent py-3 text-sm font-light text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
            dir="auto"
          />
          <p className="text-[0.65rem] font-light text-cream/40">
            {t.charactersRemaining.replace(
              "{count}",
              String(MAX_ENGRAVING_LENGTH - engravingText.length)
            )}
          </p>
        </section>

        <section className="space-y-3 border-t border-gold/10 pt-6">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.placedParts} ({placedParts.length})
          </h3>
          {placedParts.length === 0 ? (
            <p className="text-xs font-light text-cream/40">{t.noPartsYet}</p>
          ) : (
            <ul className="space-y-2">
              {placedParts.map((part) => {
                const isSelected = selectedInstanceId === part.instanceId;
                return (
                  <li key={part.instanceId}>
                    <div
                      className={cn(
                        "flex items-center gap-2 border px-3 py-2 transition-colors",
                        isSelected
                          ? "border-gold/50 bg-gold/10"
                          : "border-gold/15 hover:border-gold/30"
                      )}
                    >
                      <button
                        type="button"
                        className="flex-1 text-start text-[0.7rem] font-light text-cream/80"
                        onClick={() => selectPart(part.instanceId)}
                      >
                        {partLabel(part.partId)}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePart(part.instanceId)}
                        className="flex h-8 w-8 items-center justify-center text-cream/40 transition-colors hover:text-red-400"
                        aria-label={t.removePart}
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {selectedPart && (
          <section className="space-y-2 rounded border border-gold/15 bg-charcoal-muted/30 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold-muted">
              {t.selected}
            </p>
            <p className="font-serif text-lg text-cream">{partLabel(selectedPart.partId)}</p>
            <p className="text-xs font-light text-cream/45">{t.dragInScene}</p>
          </section>
        )}
      </div>

      <footer className="border-t border-gold/10 px-5 py-5">
        <button
          type="button"
          onClick={reset}
          className="w-full border border-gold/30 py-3 text-[0.65rem] font-light uppercase tracking-[0.2em] text-cream/70 transition-colors hover:border-gold/50 hover:text-cream"
        >
          {t.reset}
        </button>
      </footer>
    </aside>
  );
}
