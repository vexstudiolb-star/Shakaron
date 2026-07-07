"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

/** ACES filmic tonemapping + exposure lift for luxury metal highlights. */
export function LuxuryToneMapping() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return null;
}
