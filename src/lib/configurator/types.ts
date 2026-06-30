export type PartCategory = "chain" | "pendant" | "ring" | "charm" | "connector";

export type JewelryPartId =
  | "chain-cable-link"
  | "chain-curb-link"
  | "chain-rope-link"
  | "chain-box-link"
  | "chain-necklace"
  | "pendant-disc"
  | "pendant-heart"
  | "pendant-bar"
  | "pendant-teardrop"
  | "ring-band"
  | "charm-gem"
  | "connector-clasp";

export type MetalType = "yellow-gold" | "rose-gold" | "white-gold" | "platinum";

export type PlacedPart = {
  instanceId: string;
  partId: JewelryPartId;
  position: [number, number, number];
  rotation: [number, number, number];
};

export type ConfiguratorState = {
  placedParts: PlacedPart[];
  selectedInstanceId: string | null;
  activeMetal: MetalType;
  engravingText: string;
};

export type ConfiguratorAction =
  | { type: "ADD_PART"; payload: { partId: JewelryPartId; position?: [number, number, number] } }
  | { type: "REMOVE_PART"; payload: string }
  | { type: "SELECT_PART"; payload: string | null }
  | { type: "UPDATE_PART_POSITION"; payload: { instanceId: string; position: [number, number, number] } }
  | { type: "UPDATE_PART_ROTATION"; payload: { instanceId: string; rotation: [number, number, number] } }
  | { type: "SET_METAL"; payload: MetalType }
  | { type: "SET_ENGRAVING"; payload: string }
  | { type: "RESET" };

export const initialConfiguratorState: ConfiguratorState = {
  placedParts: [],
  selectedInstanceId: null,
  activeMetal: "yellow-gold",
  engravingText: "",
};

export const DND_PART_PREFIX = "part:";
export const DND_CANVAS_DROP = "canvas-drop";
