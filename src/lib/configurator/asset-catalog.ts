import type { JewelryCategory } from "./types";

export type ShankStyle = "straight" | "cathedral" | "bypass" | "classic" | "bar" | "heart" | "cable" | "tennis";
export type HeadStyle = "4prong" | "6prong" | "halo";
export type GemstoneType = "diamond" | "sapphire" | "ruby";
export type MetalFinish = "polished" | "brushed";

export const CAD_ASSET_URLS: Record<JewelryCategory, string> = {
  ring: "/models/cad/engagement-ring.glb",
  pendant: "/models/cad/pendant.glb",
  bracelet: "/models/cad/bracelet.glb",
};

export const RING_SHANK_OPTIONS: ShankStyle[] = ["straight", "cathedral", "bypass"];
export const RING_HEAD_OPTIONS: HeadStyle[] = ["4prong", "6prong", "halo"];
export const PENDANT_SHANK_OPTIONS: ShankStyle[] = ["classic", "bar", "heart"];
export const BRACELET_SHANK_OPTIONS: ShankStyle[] = ["classic", "cable", "tennis"];

export const GEMSTONE_OPTIONS: GemstoneType[] = ["diamond", "sapphire", "ruby"];

export function shankOptionsForCategory(category: JewelryCategory): ShankStyle[] {
  if (category === "ring") return RING_SHANK_OPTIONS;
  if (category === "pendant") return PENDANT_SHANK_OPTIONS;
  return BRACELET_SHANK_OPTIONS;
}

export function defaultShankForCategory(category: JewelryCategory): ShankStyle {
  return shankOptionsForCategory(category)[0];
}

export function headOptionsForCategory(category: JewelryCategory): HeadStyle[] {
  return category === "ring" ? RING_HEAD_OPTIONS : [];
}
