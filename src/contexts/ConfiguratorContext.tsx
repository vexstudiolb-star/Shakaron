"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { exportSceneToGltf, exportSceneToObj } from "@/lib/configurator/export-scene";
import {
  defaultShankForCategory,
  headOptionsForCategory,
  type GemstoneType,
  type HeadStyle,
  type MetalFinish,
  type ShankStyle,
} from "@/lib/configurator/asset-catalog";
import {
  initialConfiguratorState,
  type AccessoryType,
  type ConfiguratorAction,
  type ConfiguratorState,
  type EngraveMode,
  type JewelryCategory,
  type MetalType,
  type PlacedAccessory,
  type StampTool,
  type WorkmatIconNode,
  type WorkmatTextNode,
} from "@/lib/configurator/types";
import type { Group } from "three";

function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction
): ConfiguratorState {
  switch (action.type) {
    case "SET_CATEGORY": {
      const category = action.payload;
      const heads = headOptionsForCategory(category);
      return {
        ...state,
        category,
        accessories: [],
        shankStyle: defaultShankForCategory(category),
        headStyle: heads[0] ?? state.headStyle,
      };
    }
    case "SET_METAL":
      return { ...state, activeMetal: action.payload };
    case "SET_METAL_FINISH":
      return { ...state, metalFinish: action.payload };
    case "SET_SHANK_STYLE":
      return { ...state, shankStyle: action.payload };
    case "SET_HEAD_STYLE":
      return { ...state, headStyle: action.payload };
    case "SET_PRIMARY_GEM":
      return { ...state, primaryGem: action.payload };
    case "SET_ENGRAVE_MODE":
      return { ...state, engraveMode: action.payload };
    case "SET_STAMP_TOOL":
      return { ...state, stampTool: action.payload };
    case "SET_RING_SIZE":
      return { ...state, ring: { ...state.ring, ringSize: action.payload } };
    case "SET_RING_BAND_WIDTH":
      return { ...state, ring: { ...state.ring, bandWidth: action.payload } };
    case "SET_RING_BAND_THICKNESS":
      return { ...state, ring: { ...state.ring, bandThickness: action.payload } };
    case "SET_BRACELET_WRIST":
      return { ...state, bracelet: { ...state.bracelet, wristSize: action.payload } };
    case "SET_BRACELET_BAND_WIDTH":
      return { ...state, bracelet: { ...state.bracelet, bandWidth: action.payload } };
    case "SET_BRACELET_BAND_THICKNESS":
      return { ...state, bracelet: { ...state.bracelet, bandThickness: action.payload } };
    case "SET_PENDANT_WIDTH":
      return { ...state, pendant: { ...state.pendant, width: action.payload } };
    case "SET_PENDANT_HEIGHT":
      return { ...state, pendant: { ...state.pendant, height: action.payload } };
    case "SET_PENDANT_DEPTH":
      return { ...state, pendant: { ...state.pendant, depth: action.payload } };
    case "SET_PENDANT_LOOP":
      return { ...state, pendant: { ...state.pendant, loopRadius: action.payload } };
    case "UPSERT_WORKMAT_TEXT": {
      const exists = state.workmat.texts.some((t) => t.id === action.payload.id);
      return {
        ...state,
        workmat: {
          ...state.workmat,
          texts: exists
            ? state.workmat.texts.map((t) =>
                t.id === action.payload.id ? action.payload : t
              )
            : [...state.workmat.texts, action.payload],
        },
      };
    }
    case "REMOVE_WORKMAT_TEXT":
      return {
        ...state,
        workmat: {
          ...state.workmat,
          texts: state.workmat.texts.filter((t) => t.id !== action.payload),
        },
      };
    case "ADD_WORKMAT_ICON":
      return {
        ...state,
        workmat: { ...state.workmat, icons: [...state.workmat.icons, action.payload] },
      };
    case "REMOVE_WORKMAT_ICON":
      return {
        ...state,
        workmat: {
          ...state.workmat,
          icons: state.workmat.icons.filter((i) => i.id !== action.payload),
        },
      };
    case "ADD_ACCESSORY":
      return { ...state, accessories: [...state.accessories, action.payload] };
    case "REMOVE_ACCESSORY":
      return {
        ...state,
        accessories: state.accessories.filter((a) => a.id !== action.payload),
      };
    case "RESET":
      return initialConfiguratorState;
    default:
      return state;
  }
}

type ConfiguratorContextValue = ConfiguratorState & {
  sceneRootRef: RefObject<Group | null>;
  setCategory: (category: JewelryCategory) => void;
  setMetal: (metal: MetalType) => void;
  setMetalFinish: (finish: MetalFinish) => void;
  setShankStyle: (style: ShankStyle) => void;
  setHeadStyle: (style: HeadStyle) => void;
  setPrimaryGem: (gem: GemstoneType) => void;
  setEngraveMode: (mode: EngraveMode) => void;
  setStampTool: (tool: StampTool) => void;
  setRingSize: (size: number) => void;
  setRingBandWidth: (width: number) => void;
  setRingBandThickness: (thickness: number) => void;
  setBraceletWrist: (size: number) => void;
  setBraceletBandWidth: (width: number) => void;
  setBraceletBandThickness: (thickness: number) => void;
  setPendantWidth: (width: number) => void;
  setPendantHeight: (height: number) => void;
  setPendantDepth: (depth: number) => void;
  setPendantLoop: (radius: number) => void;
  upsertWorkmatText: (node: WorkmatTextNode) => void;
  addWorkmatIcon: (node: WorkmatIconNode) => void;
  removeWorkmatIcon: (id: string) => void;
  addAccessory: (accessory: PlacedAccessory) => void;
  removeAccessory: (id: string) => void;
  reset: () => void;
  exportObj: () => boolean;
  exportGltf: () => Promise<boolean>;
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialConfiguratorState);
  const sceneRootRef = useRef<Group | null>(null);

  const setCategory = useCallback((category: JewelryCategory) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  }, []);

  const setMetalFinish = useCallback((finish: MetalFinish) => {
    dispatch({ type: "SET_METAL_FINISH", payload: finish });
  }, []);

  const setShankStyle = useCallback((style: ShankStyle) => {
    dispatch({ type: "SET_SHANK_STYLE", payload: style });
  }, []);

  const setHeadStyle = useCallback((style: HeadStyle) => {
    dispatch({ type: "SET_HEAD_STYLE", payload: style });
  }, []);

  const setPrimaryGem = useCallback((gem: GemstoneType) => {
    dispatch({ type: "SET_PRIMARY_GEM", payload: gem });
  }, []);

  const setMetal = useCallback((metal: MetalType) => {
    dispatch({ type: "SET_METAL", payload: metal });
  }, []);

  const setEngraveMode = useCallback((mode: EngraveMode) => {
    dispatch({ type: "SET_ENGRAVE_MODE", payload: mode });
  }, []);

  const setStampTool = useCallback((tool: StampTool) => {
    dispatch({ type: "SET_STAMP_TOOL", payload: tool });
  }, []);

  const setRingSize = useCallback((size: number) => {
    dispatch({ type: "SET_RING_SIZE", payload: size });
  }, []);

  const setRingBandWidth = useCallback((width: number) => {
    dispatch({ type: "SET_RING_BAND_WIDTH", payload: width });
  }, []);

  const setRingBandThickness = useCallback((thickness: number) => {
    dispatch({ type: "SET_RING_BAND_THICKNESS", payload: thickness });
  }, []);

  const setBraceletWrist = useCallback((size: number) => {
    dispatch({ type: "SET_BRACELET_WRIST", payload: size });
  }, []);

  const setBraceletBandWidth = useCallback((width: number) => {
    dispatch({ type: "SET_BRACELET_BAND_WIDTH", payload: width });
  }, []);

  const setBraceletBandThickness = useCallback((thickness: number) => {
    dispatch({ type: "SET_BRACELET_BAND_THICKNESS", payload: thickness });
  }, []);

  const setPendantWidth = useCallback((width: number) => {
    dispatch({ type: "SET_PENDANT_WIDTH", payload: width });
  }, []);

  const setPendantHeight = useCallback((height: number) => {
    dispatch({ type: "SET_PENDANT_HEIGHT", payload: height });
  }, []);

  const setPendantDepth = useCallback((depth: number) => {
    dispatch({ type: "SET_PENDANT_DEPTH", payload: depth });
  }, []);

  const setPendantLoop = useCallback((radius: number) => {
    dispatch({ type: "SET_PENDANT_LOOP", payload: radius });
  }, []);

  const upsertWorkmatText = useCallback((node: WorkmatTextNode) => {
    dispatch({ type: "UPSERT_WORKMAT_TEXT", payload: node });
  }, []);

  const addWorkmatIcon = useCallback((node: WorkmatIconNode) => {
    dispatch({ type: "ADD_WORKMAT_ICON", payload: node });
  }, []);

  const removeWorkmatIcon = useCallback((id: string) => {
    dispatch({ type: "REMOVE_WORKMAT_ICON", payload: id });
  }, []);

  const addAccessory = useCallback((accessory: PlacedAccessory) => {
    dispatch({ type: "ADD_ACCESSORY", payload: accessory });
  }, []);

  const removeAccessory = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ACCESSORY", payload: id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const exportObj = useCallback(() => {
    if (!sceneRootRef.current) return false;
    return exportSceneToObj(sceneRootRef.current);
  }, []);

  const exportGltf = useCallback(async () => {
    if (!sceneRootRef.current) return false;
    return exportSceneToGltf(sceneRootRef.current);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      sceneRootRef,
      setCategory,
      setMetal,
      setMetalFinish,
      setShankStyle,
      setHeadStyle,
      setPrimaryGem,
      setEngraveMode,
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
      upsertWorkmatText,
      addWorkmatIcon,
      removeWorkmatIcon,
      addAccessory,
      removeAccessory,
      reset,
      exportObj,
      exportGltf,
    }),
    [
      state,
      setCategory,
      setMetal,
      setMetalFinish,
      setShankStyle,
      setHeadStyle,
      setPrimaryGem,
      setEngraveMode,
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
      upsertWorkmatText,
      addWorkmatIcon,
      removeWorkmatIcon,
      addAccessory,
      removeAccessory,
      reset,
      exportObj,
      exportGltf,
    ]
  );

  return (
    <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error("useConfigurator must be used within ConfiguratorProvider");
  }
  return context;
}

export type { AccessoryType, PlacedAccessory, WorkmatTextNode };
