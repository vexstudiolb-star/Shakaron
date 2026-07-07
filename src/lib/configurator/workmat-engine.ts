import * as THREE from "three";
import type { EngraveMode, WorkmatState } from "./types";
import { drawSymbol } from "./symbols";

export const WORKMAT_RESOLUTION = 1024;

export function renderWorkmatToCanvas(
  workmat: WorkmatState,
  canvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const target =
    canvas ??
    (typeof document !== "undefined"
      ? document.createElement("canvas")
      : null);

  if (!target) {
    throw new Error("Workmat canvas is only available in the browser");
  }

  target.width = WORKMAT_RESOLUTION;
  target.height = WORKMAT_RESOLUTION;
  const ctx = target.getContext("2d");
  if (!ctx) return target;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, WORKMAT_RESOLUTION, WORKMAT_RESOLUTION);

  for (const icon of workmat.icons) {
    ctx.fillStyle = "#ffffff";
    drawSymbol(
      ctx,
      icon.symbolId as Parameters<typeof drawSymbol>[1],
      icon.x * WORKMAT_RESOLUTION,
      icon.y * WORKMAT_RESOLUTION,
      icon.scale * 1.2
    );
  }

  for (const node of workmat.texts) {
    const trimmed = node.text.trim();
    if (!trimmed) continue;
    const fontSize = Math.floor(
      (WORKMAT_RESOLUTION * 0.12 * node.scale) / Math.max(trimmed.length * 0.12, 1)
    );
    ctx.font = `600 ${fontSize}px ${node.fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(trimmed, node.x * WORKMAT_RESOLUTION, node.y * WORKMAT_RESOLUTION);
  }

  return target;
}

export function createWorkmatTexture(workmat: WorkmatState): THREE.CanvasTexture | null {
  const hasContent =
    workmat.icons.length > 0 || workmat.texts.some((t) => t.text.trim().length > 0);
  if (!hasContent) return null;

  const canvas = renderWorkmatToCanvas(workmat);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export function getDisplacementSettings(mode: EngraveMode, hasTexture: boolean) {
  if (!hasTexture) {
    return { bumpScale: 0, displacementScale: 0, displacementBias: 0 };
  }
  if (mode === "engrave") {
    return { bumpScale: 0.02, displacementScale: -0.006, displacementBias: 0.002 };
  }
  return { bumpScale: 0.015, displacementScale: 0.008, displacementBias: -0.001 };
}

export function disposeTexture(texture: THREE.Texture | null | undefined) {
  texture?.dispose();
}
