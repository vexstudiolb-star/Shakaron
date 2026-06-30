"use client";

import { OrbitControls } from "@react-three/drei";

export function SceneControls() {
  return (
    <OrbitControls
      enablePan={false}
      minDistance={1.8}
      maxDistance={5.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 1.8}
      target={[0, 0.1, 0]}
    />
  );
}
