import type { GemstoneType, MetalFinish } from "./asset-catalog";
import type { MetalType } from "./metal-materials";

export type MetalPreset = {
  color: string;
  metalness: number;
  roughness: number;
};

export const LUXURY_METAL_PRESETS: Record<MetalType, MetalPreset> = {
  "yellow-gold": { color: "#e6ca65", metalness: 1.0, roughness: 0.08 },
  "white-gold": { color: "#f5f5f5", metalness: 1.0, roughness: 0.07 },
  "rose-gold": { color: "#b76e79", metalness: 1.0, roughness: 0.1 },
  platinum: { color: "#f5f5f5", metalness: 1.0, roughness: 0.06 },
};

export const METAL_FINISH_ROUGHNESS: Record<MetalFinish, number> = {
  polished: 0.05,
  brushed: 0.25,
};

export type GemPreset = {
  color: string;
  ior: number;
  dispersion: number;
  absorption: string;
};

export const GEMSTONE_PRESETS: Record<GemstoneType, GemPreset> = {
  diamond: { color: "#ffffff", ior: 2.417, dispersion: 0.045, absorption: "#c8e8ff" },
  sapphire: { color: "#2244aa", ior: 1.76, dispersion: 0.018, absorption: "#1133aa" },
  ruby: { color: "#aa1133", ior: 1.76, dispersion: 0.02, absorption: "#880022" },
};

export function resolveMetalRoughness(finish: MetalFinish, baseRoughness: number) {
  const finishRoughness = METAL_FINISH_ROUGHNESS[finish];
  return Math.min(0.35, Math.max(baseRoughness, finishRoughness));
}
