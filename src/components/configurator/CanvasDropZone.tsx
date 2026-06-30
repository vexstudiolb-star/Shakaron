"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { DND_CANVAS_DROP } from "@/lib/configurator/types";

type CanvasDropZoneProps = {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyLabel: string;
};

export function CanvasDropZone({ children, isEmpty, emptyLabel }: CanvasDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: DND_CANVAS_DROP });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative h-full w-full transition-shadow duration-300",
        isOver && "ring-2 ring-gold/50 ring-inset",
        isEmpty && !isOver && "ring-1 ring-dashed ring-gold/20 ring-inset"
      )}
    >
      {children}
      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p
            className={cn(
              "max-w-xs px-6 text-center text-[0.65rem] font-light uppercase tracking-[0.2em] transition-colors",
              isOver ? "text-gold-light" : "text-cream/30"
            )}
          >
            {emptyLabel}
          </p>
        </div>
      )}
    </div>
  );
}
