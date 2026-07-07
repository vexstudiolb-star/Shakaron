"use client";

import { memo } from "react";

function StudioLightingInner() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0002}
      />
      <pointLight position={[-2, 2.5, 2]} intensity={0.45} color="#fff8ee" />
      <pointLight position={[2, 1.5, -2]} intensity={0.25} color="#e8d4a8" />
    </>
  );
}

export const StudioLighting = memo(StudioLightingInner);
