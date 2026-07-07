"use client";

import Link from "next/link";
import {
  Box,
  ChevronRight,
  Circle,
  CircleDashed,
  Diamond,
  Download,
  Home,
  Layers,
  Palette,
  RotateCcw,
  Sparkles,
  View,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import { METAL_OPTIONS, METAL_SWATCH_COLORS } from "@/lib/configurator/metal-materials";
import {
  GEMSTONE_OPTIONS,
  headOptionsForCategory,
  shankOptionsForCategory,
  type GemstoneType,
  type HeadStyle,
  type MetalFinish,
  type ShankStyle,
} from "@/lib/configurator/asset-catalog";
import { GEMSTONE_PRESETS } from "@/lib/configurator/material-engine";
import { JEWELRY_CATEGORIES, type JewelryCategory, type MetalType } from "@/lib/configurator/types";
import { cn } from "@/lib/utils";
import { JewelryScene } from "../JewelrySceneLoader";

const CATEGORY_ICONS: Record<JewelryCategory, LucideIcon> = {
  ring: Circle,
  pendant: Diamond,
  bracelet: CircleDashed,
};

/** Broadcasts a studio viewport intent. Wire your 3D camera controls to these events. */
function emitViewportEvent(name: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(`studio:${name}`));
}

export function StudioShell() {
  const { locale, dict } = useLocale();
  const t = dict.configurator;
  const {
    category,
    activeMetal,
    metalFinish,
    shankStyle,
    headStyle,
    primaryGem,
    workmat,
    setCategory,
    setMetal,
    setMetalFinish,
    setShankStyle,
    setHeadStyle,
    setPrimaryGem,
    upsertWorkmatText,
    reset,
    exportObj,
    exportGltf,
  } = useConfigurator();

  const primaryText = workmat.texts[0];
  const itemName = `Custom ${t.categories[category]}`;

  // --- 3D asset-layer trigger handlers ------------------------------------
  // These keep the frontend button states in sync via the configurator store.
  // Drop additional 3D asset-layer control logic inside each handler body.

  function handleShapeChange(next: JewelryCategory) {
    setCategory(next);
    // 3D hook: swap base CAD asset / scene graph here.
  }

  function handleMetalChange(type: MetalType) {
    setMetal(type);
    // 3D hook: swap metal PBR material on metal_bands meshes here.
  }

  function handleGemChange(shape: GemstoneType) {
    setPrimaryGem(shape);
    // 3D hook: swap gemstone refraction material on stone meshes here.
  }

  function handleShankChange(style: ShankStyle) {
    setShankStyle(style);
    // 3D hook: toggle shank sub-mesh visibility here.
  }

  function handleHeadChange(style: HeadStyle) {
    setHeadStyle(style);
    // 3D hook: toggle head / prong setting visibility here.
  }

  return (
    <div className="flex h-[calc(100dvh-5rem)] w-full flex-col overflow-hidden bg-[#0a0a0c] text-zinc-200 lg:h-[calc(100dvh-6rem)]">
      {/* Header ------------------------------------------------------------ */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/60 px-4 lg:px-6">
        <nav className="flex items-center gap-2 text-xs" aria-label="Breadcrumb">
          <Link
            href={`/${locale}`}
            className="flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
            aria-label={dict.common.home}
          >
            <Home size={13} />
          </Link>
          <span className="text-zinc-500">Studio</span>
          <ChevronRight size={13} className="text-zinc-700" />
          <span className="text-zinc-500">{t.categories[category]}</span>
          <ChevronRight size={13} className="text-zinc-700" />
          <span className="font-medium text-zinc-100">{itemName}</span>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[0.65rem] font-medium text-zinc-300 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Engine: WebGL Active
          </span>
        </div>
      </header>

      {/* Workspace --------------------------------------------------------- */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Canvas viewport (70%) */}
        <section className="relative min-h-[45vh] flex-1 overflow-hidden lg:min-h-0 lg:w-[70%]">
          <div className="absolute inset-0">
            <JewelryScene />
          </div>

          {/* Floating status chip (top-left) */}
          <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-[0.65rem] font-medium text-zinc-300 backdrop-blur-md">
            <Layers size={12} className="text-amber-400/80" />
            {itemName}
          </div>

          {/* Glassmorphic floating toolbar (bottom-center) */}
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/40 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-md">
              <ToolbarButton label="Zoom in" onClick={() => emitViewportEvent("zoom-in")}>
                <ZoomIn size={16} />
              </ToolbarButton>
              <ToolbarButton label="Zoom out" onClick={() => emitViewportEvent("zoom-out")}>
                <ZoomOut size={16} />
              </ToolbarButton>
              <ToolbarButton label="Reset camera" onClick={() => emitViewportEvent("reset-camera")}>
                <RotateCcw size={16} />
              </ToolbarButton>
              <span className="mx-1 h-5 w-px bg-zinc-800" />
              <ToolbarButton label="AR view" onClick={() => emitViewportEvent("ar-view")}>
                <View size={16} />
              </ToolbarButton>
            </div>
          </div>
        </section>

        {/* Configuration sidebar (30%) */}
        <aside className="flex w-full shrink-0 flex-col overflow-y-auto border-t border-zinc-800/60 bg-[#0c0c0f] hide-scrollbar lg:w-[30%] lg:max-w-[420px] lg:border-l lg:border-t-0">
          <div className="space-y-5 p-4 lg:p-5">
            {/* Shape selectors */}
            <SectionCard icon={Box} title="Shape">
              <div className="grid grid-cols-3 gap-2">
                {JEWELRY_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleShapeChange(cat)}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all duration-200",
                        active
                          ? "border-transparent bg-zinc-900 ring-1 ring-amber-500/50 shadow-[0_0_20px_-6px_rgba(245,158,11,0.4)]"
                          : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                      )}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-colors",
                          active ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[0.6rem] font-medium uppercase tracking-wide",
                          active ? "text-zinc-100" : "text-zinc-500"
                        )}
                      >
                        {t.categories[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* Material pickers */}
            <SectionCard icon={Palette} title={t.metal}>
              <div className="flex flex-wrap gap-2">
                {METAL_OPTIONS.map((option) => (
                  <PillButton
                    key={option.id}
                    active={activeMetal === option.id}
                    color={METAL_SWATCH_COLORS[option.id]}
                    label={t.metals[option.labelKey as keyof typeof t.metals]}
                    onClick={() => handleMetalChange(option.id)}
                  />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                {(["polished", "brushed"] as MetalFinish[]).map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setMetalFinish(finish)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-[0.6rem] font-medium uppercase tracking-wide transition-colors",
                      metalFinish === finish
                        ? "border-amber-500/50 bg-zinc-900 text-amber-300"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    )}
                  >
                    {t.finishes[finish]}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Gemstone pickers */}
            <SectionCard icon={Sparkles} title={t.gemstone}>
              <div className="flex flex-wrap gap-2">
                {GEMSTONE_OPTIONS.map((gem) => (
                  <PillButton
                    key={gem}
                    active={primaryGem === gem}
                    color={GEMSTONE_PRESETS[gem].color}
                    label={t.gems[gem]}
                    onClick={() => handleGemChange(gem)}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Shank styles */}
            <SectionCard icon={Circle} title={t.shankStyles}>
              <div className="grid grid-cols-3 gap-2">
                {shankOptionsForCategory(category).map((style) => (
                  <GridButton
                    key={style}
                    active={shankStyle === style}
                    label={t.shanks[style as keyof typeof t.shanks]}
                    onClick={() => handleShankChange(style)}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Head / setting styles (rings only) */}
            {category === "ring" && (
              <SectionCard icon={Diamond} title={t.headStyles}>
                <div className="grid grid-cols-3 gap-2">
                  {headOptionsForCategory(category).map((style) => (
                    <GridButton
                      key={style}
                      active={headStyle === style}
                      label={t.heads[style as keyof typeof t.heads]}
                      onClick={() => handleHeadChange(style)}
                    />
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Engraving */}
            <SectionCard icon={Layers} title={t.workmat}>
              <input
                type="text"
                value={primaryText?.text ?? ""}
                onChange={(e) => {
                  if (!primaryText) return;
                  upsertWorkmatText({ ...primaryText, text: e.target.value.slice(0, 24) });
                }}
                placeholder={t.engravingPlaceholder}
                maxLength={24}
                dir="auto"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
            </SectionCard>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => exportObj()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-[0.7rem] font-semibold uppercase tracking-wide text-zinc-950 transition-colors hover:bg-amber-400"
              >
                <Download size={14} strokeWidth={2} />
                {t.exportObj}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void exportGltf()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2.5 text-[0.65rem] font-medium uppercase tracking-wide text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <Download size={13} />
                  {t.exportGltf}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2.5 text-[0.65rem] font-medium uppercase tracking-wide text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                >
                  <RotateCcw size={13} />
                  {t.reset}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable studio primitives                                             */
/* ---------------------------------------------------------------------- */

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={13} className="text-amber-400/80" />
        <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function PillButton({
  active,
  color,
  label,
  onClick,
}: {
  active: boolean;
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 transition-all duration-200 focus:outline-none",
        active
          ? "border-amber-500/50 bg-zinc-900 ring-1 ring-amber-500/40"
          : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
      )}
    >
      <span
        className={cn(
          "h-4 w-4 rounded-full border border-white/10 shadow-inner transition-transform duration-200",
          active ? "scale-125" : "group-hover:scale-110 group-focus-visible:scale-125"
        )}
        style={{ backgroundColor: color }}
      />
      <span
        className={cn(
          "text-[0.7rem] font-medium",
          active ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200"
        )}
      >
        {label}
      </span>
    </button>
  );
}

function GridButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border py-2.5 text-[0.6rem] font-medium uppercase tracking-wide transition-all duration-200",
        active
          ? "border-transparent bg-zinc-900 text-amber-300 ring-1 ring-amber-500/50 shadow-[0_0_16px_-6px_rgba(245,158,11,0.4)]"
          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
      )}
    >
      {label}
    </button>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-amber-300"
    >
      {children}
    </button>
  );
}
