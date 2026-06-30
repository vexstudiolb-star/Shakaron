import type { PartDefinition } from "@/lib/configurator/parts-catalog";
import { cn } from "@/lib/utils";

const shapes: Record<PartDefinition["thumbnail"], string> = {
  link: "rounded-full border-2 border-gold/50 w-5 h-5",
  disc: "rounded-full border border-gold/40 w-5 h-5 bg-gold/20",
  heart: "w-5 h-5 text-gold/60 text-xs leading-none",
  bar: "w-6 h-2 border border-gold/40 bg-gold/15",
  drop: "w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-gold/50",
  ring: "rounded-full border-2 border-gold/60 w-5 h-5",
  gem: "w-4 h-4 rotate-45 border border-gold/50 bg-gold/25",
  clasp: "w-4 h-4 border border-gold/40 rounded-sm",
  necklace: "w-6 h-4 rounded-t-full border-2 border-b-0 border-gold/40",
};

export function PartThumbnail({ type }: { type: PartDefinition["thumbnail"] }) {
  if (type === "heart") {
    return <span className={cn("flex items-center justify-center", shapes.heart)}>♥</span>;
  }
  return <span className={cn("block shrink-0", shapes[type])} aria-hidden="true" />;
}
