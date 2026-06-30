"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { ReactNode } from "react";
import { useState } from "react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { partsById } from "@/lib/configurator/parts-catalog";
import { DND_PART_PREFIX, type JewelryPartId } from "@/lib/configurator/types";
import { PartThumbnail } from "./ui/PartThumbnail";

type ConfiguratorDndProviderProps = {
  children: ReactNode;
};

export function ConfiguratorDndProvider({ children }: ConfiguratorDndProviderProps) {
  const { handleDragEnd } = useConfigurator();
  const [activePartId, setActivePartId] = useState<JewelryPartId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function onDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith(DND_PART_PREFIX)) {
      setActivePartId(id.slice(DND_PART_PREFIX.length) as JewelryPartId);
    }
  }

  function onDragEndEvent(event: DragEndEvent) {
    handleDragEnd(String(event.active.id), event.over ? String(event.over.id) : null);
    setActivePartId(null);
  }

  const activePart = activePartId ? partsById[activePartId] : null;

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEndEvent}>
      {children}
      <DragOverlay dropAnimation={null}>
        {activePart ? (
          <div className="flex items-center gap-3 border border-gold/50 bg-charcoal/95 px-4 py-3 shadow-xl">
            <PartThumbnail type={activePart.thumbnail} />
            <span className="text-[0.68rem] font-light uppercase tracking-[0.12em] text-cream">
              {activePart.id}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
