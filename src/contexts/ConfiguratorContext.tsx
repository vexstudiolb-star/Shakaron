"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { partsById } from "@/lib/configurator/parts-catalog";
import {
  DND_CANVAS_DROP,
  DND_PART_PREFIX,
  initialConfiguratorState,
  type ConfiguratorAction,
  type ConfiguratorState,
  type JewelryPartId,
  type MetalType,
} from "@/lib/configurator/types";

let instanceCounter = 0;

function nextInstanceId() {
  instanceCounter += 1;
  return `part-${instanceCounter}-${Date.now()}`;
}

function defaultPosition(index: number): [number, number, number] {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return [(col - 1) * 0.45, 0.15 - row * 0.35, 0];
}

function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction
): ConfiguratorState {
  switch (action.type) {
    case "ADD_PART": {
      const def = partsById[action.payload.partId];
      const index = state.placedParts.length;
      const position = action.payload.position ?? defaultPosition(index);
      const newPart = {
        instanceId: nextInstanceId(),
        partId: action.payload.partId,
        position,
        rotation: [...def.defaultRotation] as [number, number, number],
      };
      return {
        ...state,
        placedParts: [...state.placedParts, newPart],
        selectedInstanceId: newPart.instanceId,
      };
    }
    case "REMOVE_PART":
      return {
        ...state,
        placedParts: state.placedParts.filter((p) => p.instanceId !== action.payload),
        selectedInstanceId:
          state.selectedInstanceId === action.payload ? null : state.selectedInstanceId,
      };
    case "SELECT_PART":
      return { ...state, selectedInstanceId: action.payload };
    case "UPDATE_PART_POSITION":
      return {
        ...state,
        placedParts: state.placedParts.map((p) =>
          p.instanceId === action.payload.instanceId
            ? { ...p, position: action.payload.position }
            : p
        ),
      };
    case "UPDATE_PART_ROTATION":
      return {
        ...state,
        placedParts: state.placedParts.map((p) =>
          p.instanceId === action.payload.instanceId
            ? { ...p, rotation: action.payload.rotation }
            : p
        ),
      };
    case "SET_METAL":
      return { ...state, activeMetal: action.payload };
    case "SET_ENGRAVING":
      return { ...state, engravingText: action.payload };
    case "RESET":
      return initialConfiguratorState;
    default:
      return state;
  }
}

type ConfiguratorContextValue = ConfiguratorState & {
  addPart: (partId: JewelryPartId, position?: [number, number, number]) => void;
  removePart: (instanceId: string) => void;
  selectPart: (instanceId: string | null) => void;
  updatePartPosition: (instanceId: string, position: [number, number, number]) => void;
  updatePartRotation: (instanceId: string, rotation: [number, number, number]) => void;
  setMetal: (metal: MetalType) => void;
  setEngraving: (text: string) => void;
  reset: () => void;
  handleDragEnd: (activeId: string | null, overId: string | null) => void;
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialConfiguratorState);

  const addPart = useCallback((partId: JewelryPartId, position?: [number, number, number]) => {
    dispatch({ type: "ADD_PART", payload: { partId, position } });
  }, []);

  const removePart = useCallback((instanceId: string) => {
    dispatch({ type: "REMOVE_PART", payload: instanceId });
  }, []);

  const selectPart = useCallback((instanceId: string | null) => {
    dispatch({ type: "SELECT_PART", payload: instanceId });
  }, []);

  const updatePartPosition = useCallback(
    (instanceId: string, position: [number, number, number]) => {
      dispatch({ type: "UPDATE_PART_POSITION", payload: { instanceId, position } });
    },
    []
  );

  const updatePartRotation = useCallback(
    (instanceId: string, rotation: [number, number, number]) => {
      dispatch({ type: "UPDATE_PART_ROTATION", payload: { instanceId, rotation } });
    },
    []
  );

  const setMetal = useCallback((metal: MetalType) => {
    dispatch({ type: "SET_METAL", payload: metal });
  }, []);

  const setEngraving = useCallback((text: string) => {
    dispatch({ type: "SET_ENGRAVING", payload: text });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const handleDragEnd = useCallback(
    (activeId: string | null, overId: string | null) => {
      if (!activeId || !overId || !activeId.startsWith(DND_PART_PREFIX)) return;
      const partId = activeId.slice(DND_PART_PREFIX.length) as JewelryPartId;
      if (overId === DND_CANVAS_DROP && partsById[partId]) {
        addPart(partId);
      }
    },
    [addPart]
  );

  const value = useMemo(
    () => ({
      ...state,
      addPart,
      removePart,
      selectPart,
      updatePartPosition,
      updatePartRotation,
      setMetal,
      setEngraving,
      reset,
      handleDragEnd,
    }),
    [
      state,
      addPart,
      removePart,
      selectPart,
      updatePartPosition,
      updatePartRotation,
      setMetal,
      setEngraving,
      reset,
      handleDragEnd,
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
