"use client";

import { Suspense, memo } from "react";
import { ContactShadows } from "@react-three/drei";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { CadJewelryModel } from "./CadJewelryModel";
import { LuxuryToneMapping } from "./LuxuryToneMapping";
import { RingSceneControls } from "./RingSceneControls";
import { StampedAccessories } from "./StampedAccessories";
import { StudioLighting } from "./StudioLighting";
import { SurfaceStampHandler } from "./SurfaceStampHandler";

function SceneGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <shadowMaterial transparent opacity={0.25} />
    </mesh>
  );
}

function SceneLoader() {
  return (
    <mesh>
      <torusGeometry args={[0.5, 0.08, 24, 48]} />
      <meshStandardMaterial color="#c4a35a" wireframe />
    </mesh>
  );
}

function JewelryEngineSceneInner() {
  const { sceneRootRef, stampTool } = useConfigurator();

  return (
    <>
      <LuxuryToneMapping />
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 5, 16]} />

      <StudioLighting />

      <Suspense fallback={<SceneLoader />}>
        <group ref={sceneRootRef}>
          <CadJewelryModel />
          <StampedAccessories />
        </group>
        <SceneGround />
        <ContactShadows
          position={[0, -0.54, 0]}
          opacity={0.45}
          scale={7}
          blur={2.8}
          far={2.8}
        />
      </Suspense>

      <SurfaceStampHandler />
      <RingSceneControls enabled={stampTool === "orbit"} />
    </>
  );
}

export const JewelryEngineScene = memo(JewelryEngineSceneInner);
