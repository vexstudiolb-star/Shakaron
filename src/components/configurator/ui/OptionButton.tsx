import { cn } from "@/lib/utils";

type OptionButtonProps = {
  label: string;
  selected?: boolean;
  onClick: () => void;
  swatchColor?: string;
};

export function OptionButton({ label, selected, onClick, swatchColor }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 border px-4 py-3 text-start text-[0.7rem] font-light uppercase tracking-[0.15em] transition-all duration-300",
        selected
          ? "border-gold/60 bg-gold/10 text-cream"
          : "border-gold/15 bg-transparent text-cream/60 hover:border-gold/30 hover:text-cream"
      )}
    >
      {swatchColor && (
        <span
          className="h-4 w-4 shrink-0 rounded-full border border-cream/20"
          style={{ backgroundColor: swatchColor }}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </button>
  );
}
