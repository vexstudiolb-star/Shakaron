"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useLocale } from "@/contexts/LocaleContext";
import { ConfiguratorErrorBoundary } from "../ConfiguratorErrorBoundary";
import { JewelryEngineScene } from "./JewelryEngineScene";

export function JewelryScene() {
  const { dict } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setMounted(true);
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-sm border border-gold/10 bg-charcoal-soft lg:min-h-[520px]">
      <ConfiguratorErrorBoundary>
        {!mounted ? (
          <div className="flex h-full min-h-[420px] w-full items-center justify-center bg-charcoal-soft lg:min-h-[520px]">
            <div className="h-8 w-8 animate-pulse rounded-full border border-gold/30" />
          </div>
        ) : (
          <Canvas
            shadows
            dpr={dpr}
            camera={{ position: [0, 0.6, 3.4], fov: 40, near: 0.1, far: 30 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.12;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearColor("#0a0a0a", 1);
            }}
            style={{ width: "100%", height: "100%", display: "block", minHeight: "420px" }}
          >
            <JewelryEngineScene />
          </Canvas>
        )}
      </ConfiguratorErrorBoundary>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent px-4 py-3">
        <p className="text-center text-[0.6rem] font-light uppercase tracking-[0.25em] text-cream/40">
          {dict.configurator.sceneHint}
        </p>
      </div>
    </div>
  );
}
