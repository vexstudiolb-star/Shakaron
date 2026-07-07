"use client";

import { Download, Gem, Move3D, Orbit, Sparkles } from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import {
  METAL_OPTIONS,
  METAL_SWATCH_COLORS,
} from "@/lib/configurator/metal-materials";
import {
  GEMSTONE_OPTIONS,
  headOptionsForCategory,
  shankOptionsForCategory,
  type HeadStyle,
  type MetalFinish,
  type ShankStyle,
} from "@/lib/configurator/asset-catalog";
import {
  BRACELET_LIMITS,
  JEWELRY_CATEGORIES,
  PENDANT_LIMITS,
  RING_LIMITS,
  type BraceletDimensions,
  type JewelryCategory,
  type PendantDimensions,
  type RingDimensions,
  type StampTool,
} from "@/lib/configurator/types";
import { cn } from "@/lib/utils";
import { DimensionSlider } from "./ui/DimensionSlider";
import { WorkmatEditor } from "./workmat/WorkmatEditor";

const STAMP_TOOLS: { id: StampTool; icon: typeof Orbit; labelKey: string }[] = [
  { id: "orbit", icon: Orbit, labelKey: "toolOrbit" },
  { id: "gem", icon: Gem, labelKey: "toolGem" },
  { id: "ornament", icon: Sparkles, labelKey: "toolOrnament" },
];

export function JewelryControlPanel() {
  const { dict } = useLocale();
  const t = dict.configurator;
  const {
    category,
    activeMetal,
    metalFinish,
    shankStyle,
    headStyle,
    primaryGem,
    stampTool,
    ring,
    bracelet,
    pendant,
    accessories,
    setCategory,
    setMetal,
    setMetalFinish,
    setShankStyle,
    setHeadStyle,
    setPrimaryGem,
    setStampTool,
    setRingSize,
    setRingBandWidth,
    setRingBandThickness,
    setBraceletWrist,
    setBraceletBandWidth,
    setBraceletBandThickness,
    setPendantWidth,
    setPendantHeight,
    setPendantDepth,
    setPendantLoop,
    removeAccessory,
    reset,
    exportObj,
    exportGltf,
  } = useConfigurator();

  return (
    <aside
      className="flex h-full flex-col border-s border-gold/10 bg-charcoal/60 backdrop-blur-md"
      aria-label={t.controlPanel}
    >
      <header className="border-b border-gold/10 px-5 py-6">
        <p className="text-[0.6rem] font-light uppercase tracking-[0.3em] text-gold-muted">
          {t.personalize}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-ivory">{t.yourDesign}</h2>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 hide-scrollbar">
        <section className="space-y-3">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.category}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {JEWELRY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "border py-2.5 text-[0.6rem] uppercase tracking-[0.12em] transition-colors",
                  category === cat
                    ? "border-gold/60 bg-gold/10 text-cream"
                    : "border-gold/15 text-cream/60 hover:border-gold/35"
                )}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.metal}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {METAL_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMetal(option.id)}
                className={cn(
                  "flex flex-col items-center gap-2 border px-2 py-3 transition-all",
                  activeMetal === option.id
                    ? "border-gold/60 bg-gold/10"
                    : "border-gold/15 hover:border-gold/35"
                )}
              >
                <span
                  className="h-7 w-7 rounded-full border border-white/10 shadow-inner"
                  style={{ backgroundColor: METAL_SWATCH_COLORS[option.id] }}
                />
                <span className="text-center text-[0.55rem] uppercase tracking-[0.1em] text-cream/75">
                  {t.metals[option.labelKey as keyof typeof t.metals]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            {(["polished", "brushed"] as MetalFinish[]).map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => setMetalFinish(finish)}
                className={cn(
                  "flex-1 border py-2 text-[0.6rem] uppercase tracking-[0.12em]",
                  metalFinish === finish
                    ? "border-gold/60 bg-gold/10 text-cream"
                    : "border-gold/15 text-cream/55"
                )}
              >
                {t.finishes[finish]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 border-t border-gold/10 pt-6">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.shankStyles}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {shankOptionsForCategory(category).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setShankStyle(style as ShankStyle)}
                className={cn(
                  "border py-2 text-[0.55rem] uppercase tracking-[0.1em]",
                  shankStyle === style
                    ? "border-gold/60 bg-gold/10 text-cream"
                    : "border-gold/15 text-cream/55"
                )}
              >
                {t.shanks[style as keyof typeof t.shanks]}
              </button>
            ))}
          </div>
        </section>

        {category === "ring" && (
          <section className="space-y-3 border-t border-gold/10 pt-6">
            <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
              {t.headStyles}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {headOptionsForCategory(category).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setHeadStyle(style as HeadStyle)}
                  className={cn(
                    "border py-2 text-[0.55rem] uppercase tracking-[0.1em]",
                    headStyle === style
                      ? "border-gold/60 bg-gold/10 text-cream"
                      : "border-gold/15 text-cream/55"
                  )}
                >
                  {t.heads[style as keyof typeof t.heads]}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 border-t border-gold/10 pt-6">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.gemstone}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {GEMSTONE_OPTIONS.map((gem) => (
              <button
                key={gem}
                type="button"
                onClick={() => setPrimaryGem(gem)}
                className={cn(
                  "border py-2.5 text-[0.55rem] uppercase tracking-[0.1em]",
                  primaryGem === gem
                    ? "border-gold/60 bg-gold/10 text-cream"
                    : "border-gold/15 text-cream/55"
                )}
              >
                {t.gems[gem]}
              </button>
            ))}
          </div>
        </section>

        <CategoryDimensions
          category={category}
          ring={ring}
          bracelet={bracelet}
          pendant={pendant}
          t={t}
          setRingSize={setRingSize}
          setRingBandWidth={setRingBandWidth}
          setRingBandThickness={setRingBandThickness}
          setBraceletWrist={setBraceletWrist}
          setBraceletBandWidth={setBraceletBandWidth}
          setBraceletBandThickness={setBraceletBandThickness}
          setPendantWidth={setPendantWidth}
          setPendantHeight={setPendantHeight}
          setPendantDepth={setPendantDepth}
          setPendantLoop={setPendantLoop}
        />

        <WorkmatEditor />

        <section className="space-y-3 border-t border-gold/10 pt-6">
          <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
            {t.stampTools}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {STAMP_TOOLS.map(({ id, icon: Icon, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => setStampTool(id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 border py-3 transition-colors",
                  stampTool === id
                    ? "border-gold/60 bg-gold/10 text-cream"
                    : "border-gold/15 text-cream/55 hover:border-gold/35"
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span className="text-[0.55rem] uppercase tracking-[0.1em]">
                  {t[labelKey as keyof typeof t] as string}
                </span>
              </button>
            ))}
          </div>
          {stampTool !== "orbit" && (
            <p className="flex items-start gap-2 text-[0.65rem] font-light text-cream/45">
              <Move3D size={14} className="mt-0.5 shrink-0" />
              {t.stampHint}
            </p>
          )}
        </section>

        {accessories.length > 0 && (
          <section className="space-y-2 border-t border-gold/10 pt-6">
            <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
              {t.stampedParts} ({accessories.length})
            </h3>
            <ul className="space-y-1">
              {accessories.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border border-gold/10 px-2 py-1.5 text-xs text-cream/70"
                >
                  <span>
                    {item.type === "gem" ? t.gemStamp : t.ornamentStamp} #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAccessory(item.id)}
                    className="text-cream/40 hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="space-y-2 border-t border-gold/10 px-5 py-5">
        <button
          type="button"
          onClick={() => exportObj()}
          className="flex w-full items-center justify-center gap-2 bg-gold/90 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-gold"
        >
          <Download size={14} strokeWidth={1.75} />
          {t.exportObj}
        </button>
        <button
          type="button"
          onClick={() => void exportGltf()}
          className="flex w-full items-center justify-center gap-2 border border-gold/40 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-cream/80 transition-colors hover:border-gold/60"
        >
          <Download size={14} strokeWidth={1.75} />
          {t.exportGltf}
        </button>
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

function CategoryDimensions({
  category,
  ring,
  bracelet,
  pendant,
  t,
  setRingSize,
  setRingBandWidth,
  setRingBandThickness,
  setBraceletWrist,
  setBraceletBandWidth,
  setBraceletBandThickness,
  setPendantWidth,
  setPendantHeight,
  setPendantDepth,
  setPendantLoop,
}: {
  category: JewelryCategory;
  ring: RingDimensions;
  bracelet: BraceletDimensions;
  pendant: PendantDimensions;
  t: ReturnType<typeof useLocale>["dict"]["configurator"];
  setRingSize: (v: number) => void;
  setRingBandWidth: (v: number) => void;
  setRingBandThickness: (v: number) => void;
  setBraceletWrist: (v: number) => void;
  setBraceletBandWidth: (v: number) => void;
  setBraceletBandThickness: (v: number) => void;
  setPendantWidth: (v: number) => void;
  setPendantHeight: (v: number) => void;
  setPendantDepth: (v: number) => void;
  setPendantLoop: (v: number) => void;
}) {
  return (
    <section className="space-y-4 border-t border-gold/10 pt-6">
      <h3 className="text-[0.65rem] font-light uppercase tracking-[0.25em] text-gold">
        {t.dimensions}
      </h3>

      {category === "ring" && (
        <>
          <DimensionSlider
            id="ring-size"
            label={t.ringSize}
            value={ring.ringSize}
            min={RING_LIMITS.ringSize.min}
            max={RING_LIMITS.ringSize.max}
            step={RING_LIMITS.ringSize.step}
            unit="mm"
            onChange={setRingSize}
          />
          <DimensionSlider
            id="ring-band-width"
            label={t.bandWidth}
            value={ring.bandWidth}
            min={RING_LIMITS.bandWidth.min}
            max={RING_LIMITS.bandWidth.max}
            step={RING_LIMITS.bandWidth.step}
            unit="mm"
            onChange={setRingBandWidth}
          />
          <DimensionSlider
            id="ring-band-thickness"
            label={t.bandThickness}
            value={ring.bandThickness}
            min={RING_LIMITS.bandThickness.min}
            max={RING_LIMITS.bandThickness.max}
            step={RING_LIMITS.bandThickness.step}
            unit="mm"
            onChange={setRingBandThickness}
          />
        </>
      )}

      {category === "bracelet" && (
        <>
          <DimensionSlider
            id="bracelet-wrist"
            label={t.wristSize}
            value={bracelet.wristSize}
            min={BRACELET_LIMITS.wristSize.min}
            max={BRACELET_LIMITS.wristSize.max}
            step={BRACELET_LIMITS.wristSize.step}
            unit="mm"
            onChange={setBraceletWrist}
          />
          <DimensionSlider
            id="bracelet-band-width"
            label={t.bandWidth}
            value={bracelet.bandWidth}
            min={BRACELET_LIMITS.bandWidth.min}
            max={BRACELET_LIMITS.bandWidth.max}
            step={BRACELET_LIMITS.bandWidth.step}
            unit="mm"
            onChange={setBraceletBandWidth}
          />
          <DimensionSlider
            id="bracelet-band-thickness"
            label={t.bandThickness}
            value={bracelet.bandThickness}
            min={BRACELET_LIMITS.bandThickness.min}
            max={BRACELET_LIMITS.bandThickness.max}
            step={BRACELET_LIMITS.bandThickness.step}
            unit="mm"
            onChange={setBraceletBandThickness}
          />
        </>
      )}

      {category === "pendant" && (
        <>
          <DimensionSlider
            id="pendant-width"
            label={t.pendantWidth}
            value={pendant.width}
            min={PENDANT_LIMITS.width.min}
            max={PENDANT_LIMITS.width.max}
            step={PENDANT_LIMITS.width.step}
            unit="mm"
            onChange={setPendantWidth}
          />
          <DimensionSlider
            id="pendant-height"
            label={t.pendantHeight}
            value={pendant.height}
            min={PENDANT_LIMITS.height.min}
            max={PENDANT_LIMITS.height.max}
            step={PENDANT_LIMITS.height.step}
            unit="mm"
            onChange={setPendantHeight}
          />
          <DimensionSlider
            id="pendant-depth"
            label={t.pendantDepth}
            value={pendant.depth}
            min={PENDANT_LIMITS.depth.min}
            max={PENDANT_LIMITS.depth.max}
            step={PENDANT_LIMITS.depth.step}
            unit="mm"
            onChange={setPendantDepth}
          />
          <DimensionSlider
            id="pendant-loop"
            label={t.loopRadius}
            value={pendant.loopRadius}
            min={PENDANT_LIMITS.loopRadius.min}
            max={PENDANT_LIMITS.loopRadius.max}
            step={PENDANT_LIMITS.loopRadius.step}
            unit="mm"
            onChange={setPendantLoop}
          />
        </>
      )}
    </section>
  );
}
