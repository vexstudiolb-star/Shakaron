"use client";

import { OrbitControls } from "@react-three/drei";
import { memo, useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type RingSceneControlsProps = {
  enabled?: boolean;
};

const ZOOM_FACTOR = 0.82;

function RingSceneControlsInner({ enabled = true }: RingSceneControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    controls?.saveState();

    function onZoomIn() {
      controlsRef.current?.dollyIn(ZOOM_FACTOR);
      controlsRef.current?.update();
    }

    function onZoomOut() {
      controlsRef.current?.dollyOut(ZOOM_FACTOR);
      controlsRef.current?.update();
    }

    function onResetCamera() {
      controlsRef.current?.reset();
    }

    window.addEventListener("studio:zoom-in", onZoomIn);
    window.addEventListener("studio:zoom-out", onZoomOut);
    window.addEventListener("studio:reset-camera", onResetCamera);

    return () => {
      window.removeEventListener("studio:zoom-in", onZoomIn);
      window.removeEventListener("studio:zoom-out", onZoomOut);
      window.removeEventListener("studio:reset-camera", onResetCamera);
    };
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enabled}
      enablePan={false}
      minDistance={2}
      maxDistance={10}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={[0, 0, 0]}
      makeDefault
    />
  );
}

export const RingSceneControls = memo(RingSceneControlsInner);
