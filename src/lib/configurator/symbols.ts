import type { SymbolId } from "./types";

const SIZE = 48;

export const SYMBOL_DEFINITIONS: Record<
  SymbolId,
  { labelKey: string; draw: (ctx: CanvasRenderingContext2D) => void }
> = {
  heart: {
    labelKey: "heart",
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(0, SIZE * 0.3);
      ctx.bezierCurveTo(0, -SIZE * 0.1, -SIZE * 0.5, -SIZE * 0.1, 0, SIZE * 0.45);
      ctx.bezierCurveTo(SIZE * 0.5, -SIZE * 0.1, 0, -SIZE * 0.1, 0, SIZE * 0.3);
      ctx.closePath();
      ctx.fill();
    },
  },
  star: {
    labelKey: "star",
    draw(ctx) {
      const spikes = 5;
      const outer = SIZE * 0.45;
      const inner = SIZE * 0.2;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    },
  },
  infinity: {
    labelKey: "infinity",
    draw(ctx) {
      ctx.font = `bold ${SIZE * 0.9}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("∞", 0, 2);
    },
  },
  diamond: {
    labelKey: "diamond",
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(0, -SIZE * 0.45);
      ctx.lineTo(SIZE * 0.38, 0);
      ctx.lineTo(0, SIZE * 0.45);
      ctx.lineTo(-SIZE * 0.38, 0);
      ctx.closePath();
      ctx.fill();
    },
  },
};

export function drawSymbol(
  ctx: CanvasRenderingContext2D,
  symbolId: SymbolId,
  x: number,
  y: number,
  scale: number
) {
  const def = SYMBOL_DEFINITIONS[symbolId as SymbolId];
  if (!def) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  def.draw(ctx);
  ctx.restore();
}
