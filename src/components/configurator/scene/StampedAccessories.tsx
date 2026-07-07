"use client";

import { memo } from "react";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import type { AccessoryType } from "@/lib/configurator/types";

function AccessoryMesh({ type }: { type: AccessoryType }) {
  if (type === "gem") {
    return (
      <mesh castShadow>
        <octahedronGeometry args={[0.06, 0]} />
        <meshPhysicalMaterial
          color="#7ec8ff"
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          thickness={0.4}
          ior={1.8}
        />
      </mesh>
    );
  }

  return (
    <mesh castShadow>
      <torusKnotGeometry args={[0.045, 0.012, 64, 8]} />
      <meshStandardMaterial color="#e6ca65" metalness={1} roughness={0.2} />
    </mesh>
  );
}

function StampedAccessoriesInner() {
  const { accessories } = useConfigurator();

  return (
    <group>
      {accessories.map((item) => (
        <group
          key={item.id}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <AccessoryMesh type={item.type} />
        </group>
      ))}
    </group>
  );
}

export const StampedAccessories = memo(StampedAccessoriesInner);
