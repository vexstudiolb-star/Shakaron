import type { JewelryPartId, PartCategory } from "./types";

export type PartDefinition = {
  id: JewelryPartId;
  category: PartCategory;
  labelKey: string;
  model: string;
  defaultScale: number;
  defaultRotation: [number, number, number];
  thumbnail: "link" | "disc" | "heart" | "bar" | "drop" | "ring" | "gem" | "clasp" | "necklace";
};

const base = "/models/jewelry";

export const jewelryParts: PartDefinition[] = [
  {
    id: "chain-cable-link",
    category: "chain",
    labelKey: "cableLink",
    model: `${base}/chain-cable-link.glb`,
    defaultScale: 1,
    defaultRotation: [Math.PI / 2, 0, 0],
    thumbnail: "link",
  },
  {
    id: "chain-curb-link",
    category: "chain",
    labelKey: "curbLink",
    model: `${base}/chain-curb-link.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "link",
  },
  {
    id: "chain-rope-link",
    category: "chain",
    labelKey: "ropeLink",
    model: `${base}/chain-rope-link.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "link",
  },
  {
    id: "chain-box-link",
    category: "chain",
    labelKey: "boxLink",
    model: `${base}/chain-box-link.glb`,
    defaultScale: 1,
    defaultRotation: [Math.PI / 2, 0, 0],
    thumbnail: "link",
  },
  {
    id: "chain-necklace",
    category: "chain",
    labelKey: "necklace",
    model: `${base}/chain-necklace.glb`,
    defaultScale: 1,
    defaultRotation: [Math.PI / 2, 0, 0],
    thumbnail: "necklace",
  },
  {
    id: "pendant-disc",
    category: "pendant",
    labelKey: "disc",
    model: `${base}/pendant-disc.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "disc",
  },
  {
    id: "pendant-heart",
    category: "pendant",
    labelKey: "heart",
    model: `${base}/pendant-heart.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "heart",
  },
  {
    id: "pendant-bar",
    category: "pendant",
    labelKey: "bar",
    model: `${base}/pendant-bar.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "bar",
  },
  {
    id: "pendant-teardrop",
    category: "pendant",
    labelKey: "teardrop",
    model: `${base}/pendant-teardrop.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "drop",
  },
  {
    id: "ring-band",
    category: "ring",
    labelKey: "ringBand",
    model: `${base}/ring-band.glb`,
    defaultScale: 1,
    defaultRotation: [Math.PI / 2, 0, 0],
    thumbnail: "ring",
  },
  {
    id: "charm-gem",
    category: "charm",
    labelKey: "gem",
    model: `${base}/charm-gem.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "gem",
  },
  {
    id: "connector-clasp",
    category: "connector",
    labelKey: "clasp",
    model: `${base}/connector-clasp.glb`,
    defaultScale: 1,
    defaultRotation: [0, 0, 0],
    thumbnail: "clasp",
  },
];

export const partsById = Object.fromEntries(
  jewelryParts.map((p) => [p.id, p])
) as Record<JewelryPartId, PartDefinition>;

export const partsByCategory = jewelryParts.reduce(
  (acc, part) => {
    if (!acc[part.category]) acc[part.category] = [];
    acc[part.category].push(part);
    return acc;
  },
  {} as Record<PartCategory, PartDefinition[]>
);

export type OptionItem<T extends string> = {
  id: T;
  labelKey: string;
};

export const metalOptions: OptionItem<
  "yellow-gold" | "rose-gold" | "white-gold" | "platinum"
>[] = [
  { id: "yellow-gold", labelKey: "yellowGold" },
  { id: "rose-gold", labelKey: "roseGold" },
  { id: "white-gold", labelKey: "whiteGold" },
  { id: "platinum", labelKey: "platinum" },
];

export const metalColors = {
  "yellow-gold": "#c4a35a",
  "rose-gold": "#b76e79",
  "white-gold": "#e8e4dc",
  platinum: "#d4d8de",
} as const;

export const metalRoughness = {
  "yellow-gold": 0.22,
  "rose-gold": 0.25,
  "white-gold": 0.18,
  platinum: 0.15,
} as const;

export function getPartDownloadUrl(partId: JewelryPartId) {
  return partsById[partId].model;
}

export const allModelsZipHint = "/models/jewelry/manifest.json";
