"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Download } from "lucide-react";
import type { PartDefinition } from "@/lib/configurator/parts-catalog";
import { getPartDownloadUrl } from "@/lib/configurator/parts-catalog";
import { DND_PART_PREFIX } from "@/lib/configurator/types";
import { cn } from "@/lib/utils";
import { PartThumbnail } from "./PartThumbnail";

type DraggablePartCardProps = {
  part: PartDefinition;
  label: string;
  onAdd: () => void;
};

export function DraggablePartCard({ part, label, onAdd }: DraggablePartCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${DND_PART_PREFIX}${part.id}`,
    data: { partId: part.id },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative border border-gold/15 bg-charcoal-muted/40 transition-all duration-300",
        isDragging && "z-50 border-gold/50 opacity-90 shadow-lg shadow-black/40"
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 px-3 py-3 text-start cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
        onDoubleClick={onAdd}
      >
        <PartThumbnail type={part.thumbnail} />
        <span className="flex-1 text-[0.68rem] font-light uppercase tracking-[0.12em] text-cream/80">
          {label}
        </span>
      </button>

      <a
        href={getPartDownloadUrl(part.id)}
        download
        className="absolute end-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-charcoal/80 text-cream/50 opacity-0 transition-opacity hover:border-gold/40 hover:text-gold-light group-hover:opacity-100"
        title="Download GLB"
        onClick={(e) => e.stopPropagation()}
      >
        <Download size={12} strokeWidth={1.5} />
      </a>
    </div>
  );
}
