import type { GemstoneType, HeadStyle, MetalFinish, ShankStyle } from "./asset-catalog";
import type { MetalType } from "./metal-materials";

export type { MetalType };

export type JewelryCategory = "ring" | "pendant" | "bracelet";
export type EngraveMode = "engrave" | "emboss";
export type StampTool = "orbit" | "gem" | "ornament";
export type AccessoryType = "gem" | "ornament";

export type WorkmatTextNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  fontFamily: string;
};

export type WorkmatIconNode = {
  id: string;
  symbolId: string;
  x: number;
  y: number;
  scale: number;
};

export type PlacedAccessory = {
  id: string;
  type: AccessoryType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export type RingDimensions = {
  ringSize: number;
  bandWidth: number;
  bandThickness: number;
};

export type BraceletDimensions = {
  wristSize: number;
  bandWidth: number;
  bandThickness: number;
};

export type PendantDimensions = {
  width: number;
  height: number;
  depth: number;
  loopRadius: number;
};

export type WorkmatState = {
  texts: WorkmatTextNode[];
  icons: WorkmatIconNode[];
};

export const RING_LIMITS = {
  ringSize: { min: 14, max: 22, step: 0.5, default: 17 },
  bandWidth: { min: 2, max: 6, step: 0.25, default: 3.5 },
  bandThickness: { min: 1.2, max: 4, step: 0.1, default: 2 },
} as const;

export const BRACELET_LIMITS = {
  wristSize: { min: 150, max: 210, step: 2, default: 170 },
  bandWidth: { min: 3, max: 10, step: 0.25, default: 5 },
  bandThickness: { min: 1.5, max: 5, step: 0.1, default: 2.5 },
} as const;

export const PENDANT_LIMITS = {
  width: { min: 10, max: 28, step: 0.5, default: 16 },
  height: { min: 14, max: 32, step: 0.5, default: 20 },
  depth: { min: 1.5, max: 6, step: 0.1, default: 2.5 },
  loopRadius: { min: 2, max: 5, step: 0.1, default: 3 },
} as const;

export const JEWELRY_CATEGORIES: JewelryCategory[] = ["ring", "pendant", "bracelet"];

export const SYMBOL_IDS = ["heart", "star", "infinity", "diamond"] as const;
export type SymbolId = (typeof SYMBOL_IDS)[number];

export const FONT_OPTIONS = [
  "Qunotz DEMO, sans-serif",
  "Georgia, serif",
  "Inter, sans-serif",
  "Cairo, sans-serif",
] as const;

export type ConfiguratorState = {
  category: JewelryCategory;
  activeMetal: MetalType;
  metalFinish: MetalFinish;
  shankStyle: ShankStyle;
  headStyle: HeadStyle;
  primaryGem: GemstoneType;
  engraveMode: EngraveMode;
  stampTool: StampTool;
  workmat: WorkmatState;
  ring: RingDimensions;
  bracelet: BraceletDimensions;
  pendant: PendantDimensions;
  accessories: PlacedAccessory[];
};

export type ConfiguratorAction =
  | { type: "SET_CATEGORY"; payload: JewelryCategory }
  | { type: "SET_METAL"; payload: MetalType }
  | { type: "SET_METAL_FINISH"; payload: MetalFinish }
  | { type: "SET_SHANK_STYLE"; payload: ShankStyle }
  | { type: "SET_HEAD_STYLE"; payload: HeadStyle }
  | { type: "SET_PRIMARY_GEM"; payload: GemstoneType }
  | { type: "SET_ENGRAVE_MODE"; payload: EngraveMode }
  | { type: "SET_STAMP_TOOL"; payload: StampTool }
  | { type: "SET_RING_SIZE"; payload: number }
  | { type: "SET_RING_BAND_WIDTH"; payload: number }
  | { type: "SET_RING_BAND_THICKNESS"; payload: number }
  | { type: "SET_BRACELET_WRIST"; payload: number }
  | { type: "SET_BRACELET_BAND_WIDTH"; payload: number }
  | { type: "SET_BRACELET_BAND_THICKNESS"; payload: number }
  | { type: "SET_PENDANT_WIDTH"; payload: number }
  | { type: "SET_PENDANT_HEIGHT"; payload: number }
  | { type: "SET_PENDANT_DEPTH"; payload: number }
  | { type: "SET_PENDANT_LOOP"; payload: number }
  | { type: "UPSERT_WORKMAT_TEXT"; payload: WorkmatTextNode }
  | { type: "REMOVE_WORKMAT_TEXT"; payload: string }
  | { type: "ADD_WORKMAT_ICON"; payload: WorkmatIconNode }
  | { type: "REMOVE_WORKMAT_ICON"; payload: string }
  | { type: "ADD_ACCESSORY"; payload: PlacedAccessory }
  | { type: "REMOVE_ACCESSORY"; payload: string }
  | { type: "RESET" };

let nodeCounter = 0;
export function nextNodeId(prefix: string) {
  nodeCounter += 1;
  return `${prefix}-${nodeCounter}`;
}

export const initialConfiguratorState: ConfiguratorState = {
  category: "ring",
  activeMetal: "yellow-gold",
  metalFinish: "polished",
  shankStyle: "straight",
  headStyle: "4prong",
  primaryGem: "diamond",
  engraveMode: "engrave",
  stampTool: "orbit",
  workmat: {
    texts: [
      {
        id: "text-primary",
        text: "",
        x: 0.5,
        y: 0.5,
        scale: 1,
        fontFamily: FONT_OPTIONS[0],
      },
    ],
    icons: [],
  },
  ring: {
    ringSize: RING_LIMITS.ringSize.default,
    bandWidth: RING_LIMITS.bandWidth.default,
    bandThickness: RING_LIMITS.bandThickness.default,
  },
  bracelet: {
    wristSize: BRACELET_LIMITS.wristSize.default,
    bandWidth: BRACELET_LIMITS.bandWidth.default,
    bandThickness: BRACELET_LIMITS.bandThickness.default,
  },
  pendant: {
    width: PENDANT_LIMITS.width.default,
    height: PENDANT_LIMITS.height.default,
    depth: PENDANT_LIMITS.depth.default,
    loopRadius: PENDANT_LIMITS.loopRadius.default,
  },
  accessories: [],
};
