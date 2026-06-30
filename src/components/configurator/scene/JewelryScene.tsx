"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { useLocale } from "@/contexts/LocaleContext";
import { CanvasDropZone } from "../CanvasDropZone";
import { DesignAssembly } from "./JewelryPartModel";
import { SceneGround } from "./SceneEnvironment";
import { SceneControls } from "./SceneControls";

function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#c4a35a" wireframe />
    </mesh>
  );
}

function SceneContent() {
  const { selectPart } = useConfigurator();

  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <fog attach="fog" args={["#0c0c0c", 4, 12]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#e2d4a8" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#faf8f4" />

      <Suspense fallback={<SceneLoader />}>
        <group onClick={() => selectPart(null)}>
          <DesignAssembly />
        </group>
        <SceneGround />
        <ContactShadows
          position={[0, -0.74, 0]}
          opacity={0.35}
          scale={8}
          blur={2}
          far={2}
        />
      </Suspense>

      <SceneControls />
    </>
  );
}

export function JewelryScene() {
  const { dict } = useLocale();
  const { placedParts } = useConfigurator();
  const isEmpty = placedParts.length === 0;

  return (
    <div className="relative min-h-[45vh] h-[50vh] w-full overflow-hidden rounded-sm border border-gold/10 bg-charcoal-soft lg:h-full lg:min-h-[480px]">
      <CanvasDropZone isEmpty={isEmpty} emptyLabel={dict.configurator.dropHere}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.8, 3.2], fov: 42 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <SceneContent />
        </Canvas>
      </CanvasDropZone>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent px-4 py-3">
        <p className="text-center text-[0.6rem] font-light uppercase tracking-[0.25em] text-cream/40">
          {dict.configurator.sceneHint}
        </p>
      </div>
    </div>
  );
}
