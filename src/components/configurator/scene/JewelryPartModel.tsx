"use client";

import { useEffect, useMemo } from "react";
import { Text, useGLTF } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import {
  metalColors,
  metalRoughness,
  partsById,
} from "@/lib/configurator/parts-catalog";
import type { JewelryPartId, MetalType } from "@/lib/configurator/types";

type JewelryPartModelProps = {
  partId: JewelryPartId;
  metal: MetalType;
  scale?: number;
  engraving?: string;
  showEngraving?: boolean;
};

export function JewelryPartModel({
  partId,
  metal,
  scale = 1,
  engraving,
  showEngraving,
}: JewelryPartModelProps) {
  const def = partsById[partId];
  const { scene } = useGLTF(def.model);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const color = metalColors[metal];
  const roughness = metalRoughness[metal];

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as MeshStandardMaterial;
        if (mat?.clone) {
          const clonedMat = mat.clone();
          clonedMat.color.set(color);
          clonedMat.metalness = 0.92;
          clonedMat.roughness = roughness;
          mesh.material = clonedMat;
        }
      }
    });
  }, [cloned, color, roughness]);

  return (
    <group scale={scale * def.defaultScale}>
      <primitive object={cloned} />
      {showEngraving && engraving?.trim() && (
        <Text
          position={[0, 0.15, 0.05]}
          fontSize={0.07}
          color="#1a1a1a"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.5}
        >
          {engraving}
        </Text>
      )}
    </group>
  );
}

export function DesignAssembly() {
  const {
    placedParts,
    selectedInstanceId,
    activeMetal,
    engravingText,
    selectPart,
  } = useConfigurator();

  if (placedParts.length === 0) return null;

  return (
    <>
      {placedParts.map((part) => (
        <group
          key={part.instanceId}
          position={part.position}
          rotation={part.rotation}
          onClick={(e) => {
            e.stopPropagation();
            selectPart(part.instanceId);
          }}
        >
          <JewelryPartModel
            partId={part.partId}
            metal={activeMetal}
            engraving={engravingText}
            showEngraving={
              part.partId.startsWith("pendant-") &&
              selectedInstanceId === part.instanceId
            }
          />
          {selectedInstanceId === part.instanceId && (
            <mesh>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshBasicMaterial color="#c4a35a" wireframe transparent opacity={0.4} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}
