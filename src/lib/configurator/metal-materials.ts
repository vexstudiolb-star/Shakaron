export type MetalType = "yellow-gold" | "white-gold" | "rose-gold" | "platinum";

export type MetalMaterialConfig = {
  metalness: number;
  roughness: number;
  color: string;
};

export const METAL_MATERIALS: Record<MetalType, MetalMaterialConfig> = {
  "yellow-gold": { metalness: 1.0, roughness: 0.08, color: "#e6ca65" },
  "white-gold": { metalness: 1.0, roughness: 0.07, color: "#f5f5f5" },
  "rose-gold": { metalness: 1.0, roughness: 0.1, color: "#b76e79" },
  platinum: { metalness: 1.0, roughness: 0.06, color: "#f5f5f5" },
};

export const METAL_OPTIONS: { id: MetalType; labelKey: string }[] = [
  { id: "yellow-gold", labelKey: "yellowGold" },
  { id: "white-gold", labelKey: "whiteGold" },
  { id: "rose-gold", labelKey: "roseGold" },
  { id: "platinum", labelKey: "platinum" },
];

export const METAL_SWATCH_COLORS: Record<MetalType, string> = {
  "yellow-gold": "#e6ca65",
  "white-gold": "#f5f5f5",
  "rose-gold": "#b76e79",
  platinum: "#e8e8e8",
};
