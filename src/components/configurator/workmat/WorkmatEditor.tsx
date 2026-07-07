"use client";

import { useEffect, useRef } from "react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import { FONT_OPTIONS, SYMBOL_IDS, nextNodeId } from "@/lib/configurator/types";
import { renderWorkmatToCanvas, WORKMAT_RESOLUTION } from "@/lib/configurator/workmat-engine";
import { cn } from "@/lib/utils";

const PREVIEW_SIZE = 200;

export function WorkmatEditor() {
  const { dict } = useLocale();
  const t = dict.configurator;
  const {
    workmat,
    engraveMode,
    setEngraveMode,
    upsertWorkmatText,
    addWorkmatIcon,
    removeWorkmatIcon,
  } = useConfigurator();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryText = workmat.texts[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderWorkmatToCanvas(workmat, canvas);
  }, [workmat]);

  function stampIcon(symbolId: string) {
    addWorkmatIcon({
      id: nextNodeId("icon"),
      symbolId,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      scale: 0.9 + Math.random() * 0.3,
    });
  }

  return (
    <section className="space-y-4 border-t border-gold/10 pt-6">
      <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
        {t.workmat}
      </h3>

      <div className="overflow-hidden rounded border border-gold/15 bg-charcoal-muted/40 p-2">
        <canvas
          ref={canvasRef}
          width={WORKMAT_RESOLUTION}
          height={WORKMAT_RESOLUTION}
          className="mx-auto block rounded-sm"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          aria-label={t.workmatPreview}
        />
      </div>

      <div className="flex gap-2">
        {(["engrave", "emboss"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setEngraveMode(mode)}
            className={cn(
              "flex-1 border py-2 text-[0.6rem] uppercase tracking-[0.15em] transition-colors",
              engraveMode === mode
                ? "border-gold/60 bg-gold/10 text-cream"
                : "border-gold/15 text-cream/55 hover:border-gold/35"
            )}
          >
            {t[mode]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="workmat-text"
          className="block text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold"
        >
          {t.engravingLabel}
        </label>
        <input
          id="workmat-text"
          type="text"
          value={primaryText?.text ?? ""}
          onChange={(e) => {
            if (!primaryText) return;
            upsertWorkmatText({
              ...primaryText,
              text: e.target.value.slice(0, 24),
            });
          }}
          placeholder={t.engravingPlaceholder}
          className="w-full border-b border-cream/20 bg-transparent py-2 text-sm font-light text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
          dir="auto"
        />
        <select
          value={primaryText?.fontFamily ?? FONT_OPTIONS[0]}
          onChange={(e) => {
            if (!primaryText) return;
            upsertWorkmatText({ ...primaryText, fontFamily: e.target.value });
          }}
          className="w-full border border-gold/15 bg-charcoal px-2 py-2 text-xs text-cream"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>
              {font.split(",")[0]}
            </option>
          ))}
        </select>
        <DimensionInline
          label={t.textScale}
          value={primaryText?.scale ?? 1}
          min={0.5}
          max={2}
          step={0.1}
          onChange={(scale) => {
            if (!primaryText) return;
            upsertWorkmatText({ ...primaryText, scale });
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
          {t.symbols}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SYMBOL_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => stampIcon(id)}
              className="flex aspect-square items-center justify-center border border-gold/15 text-lg text-cream/80 transition-colors hover:border-gold/40 hover:bg-gold/5"
              title={t.symbolLabels[id as keyof typeof t.symbolLabels]}
            >
              {id === "heart" && "♥"}
              {id === "star" && "★"}
              {id === "infinity" && "∞"}
              {id === "diamond" && "◆"}
            </button>
          ))}
        </div>
      </div>

      {workmat.icons.length > 0 && (
        <ul className="space-y-1">
          {workmat.icons.map((icon) => (
            <li
              key={icon.id}
              className="flex items-center justify-between border border-gold/10 px-2 py-1.5 text-xs text-cream/70"
            >
              <span>{t.symbolLabels[icon.symbolId as keyof typeof t.symbolLabels]}</span>
              <button
                type="button"
                onClick={() => removeWorkmatIcon(icon.id)}
                className="text-cream/40 hover:text-red-400"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DimensionInline({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[0.6rem] text-cream/50">
        <span>{label}</span>
        <span>{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 w-full accent-gold"
      />
    </div>
  );
}
