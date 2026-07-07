import type { BraceletDimensions, PendantDimensions, RingDimensions } from "./types";

const MM_TO_SCENE = 1 / 17;

export type TorusBuild = {
  kind: "torus";
  majorRadius: number;
  tubeRadius: number;
  radialSegments: number;
  tubularSegments: number;
  scaleZ: number;
  rotation: [number, number, number];
};

export type PendantBuild = {
  kind: "pendant";
  body: { width: number; height: number; depth: number };
  loop: { radius: number; tube: number };
};

export type BraceletBuild = TorusBuild;

export function buildRingGeometry(ring: RingDimensions, detail: number): TorusBuild {
  const innerRadius = ring.ringSize / 2;
  const majorRadius = innerRadius + ring.bandThickness / 2;
  const tubeRadius = Math.max(ring.bandWidth / 2, ring.bandThickness / 2);
  const segments = detail > 0 ? 64 : 48;
  return {
    kind: "torus",
    majorRadius: majorRadius * MM_TO_SCENE,
    tubeRadius: tubeRadius * MM_TO_SCENE,
    radialSegments: segments,
    tubularSegments: segments * 2,
    scaleZ: ring.bandThickness / ring.bandWidth,
    rotation: [Math.PI / 2, 0, 0],
  };
}

export function buildBraceletGeometry(
  bracelet: BraceletDimensions,
  detail: number
): BraceletBuild {
  const majorRadius = bracelet.wristSize / (2 * Math.PI);
  const tubeRadius = Math.max(bracelet.bandWidth / 2, bracelet.bandThickness / 2);
  const scale = MM_TO_SCENE * 1.35;
  const segments = detail > 0 ? 72 : 56;
  return {
    kind: "torus",
    majorRadius: majorRadius * scale,
    tubeRadius: tubeRadius * scale,
    radialSegments: segments,
    tubularSegments: segments * 2,
    scaleZ: bracelet.bandThickness / bracelet.bandWidth,
    rotation: [Math.PI / 2, 0, 0],
  };
}

export function buildPendantGeometry(pendant: PendantDimensions): PendantBuild {
  const scale = MM_TO_SCENE;
  return {
    kind: "pendant",
    body: {
      width: pendant.width * scale,
      height: pendant.height * scale,
      depth: pendant.depth * scale,
    },
    loop: {
      radius: pendant.loopRadius * scale,
      tube: pendant.loopRadius * scale * 0.28,
    },
  };
}
