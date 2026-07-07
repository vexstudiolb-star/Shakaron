"use client";

import { memo, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import {
  buildBraceletGeometry,
  buildPendantGeometry,
  buildRingGeometry,
} from "@/lib/configurator/geometry-builders";
import { JEWELRY_BASE_FLAG, JewelryMaterial } from "./JewelryMaterial";

function BaseJewelryMeshInner() {
  const { category, ring, bracelet, pendant, workmat } = useConfigurator();

  const hasWorkmat =
    workmat.icons.length > 0 || workmat.texts.some((t) => t.text.trim().length > 0);
  const detail = hasWorkmat ? 1 : 0;

  const ringBuild = useMemo(
    () => (category === "ring" ? buildRingGeometry(ring, detail) : null),
    [category, ring, detail]
  );
  const braceletBuild = useMemo(
    () => (category === "bracelet" ? buildBraceletGeometry(bracelet, detail) : null),
    [category, bracelet, detail]
  );
  const pendantBuild = useMemo(
    () => (category === "pendant" ? buildPendantGeometry(pendant) : null),
    [category, pendant]
  );

  const ringGeometry = useMemo(() => {
    if (!ringBuild) return null;
    return new THREE.TorusGeometry(
      ringBuild.majorRadius,
      ringBuild.tubeRadius,
      ringBuild.radialSegments,
      ringBuild.tubularSegments
    );
  }, [ringBuild]);

  const braceletGeometry = useMemo(() => {
    if (!braceletBuild) return null;
    return new THREE.TorusGeometry(
      braceletBuild.majorRadius,
      braceletBuild.tubeRadius,
      braceletBuild.radialSegments,
      braceletBuild.tubularSegments
    );
  }, [braceletBuild]);

  const pendantBodyGeometry = useMemo(() => {
    if (!pendantBuild) return null;
    const { width, height, depth } = pendantBuild.body;
    const geo = new THREE.BoxGeometry(width, height, depth, 12, 16, 4);
    geo.translate(0, -height * 0.15, 0);
    return geo;
  }, [pendantBuild]);

  const pendantLoopGeometry = useMemo(() => {
    if (!pendantBuild) return null;
    return new THREE.TorusGeometry(
      pendantBuild.loop.radius,
      pendantBuild.loop.tube,
      24,
      48
    );
  }, [pendantBuild]);

  useEffect(() => {
    return () => {
      ringGeometry?.dispose();
      braceletGeometry?.dispose();
      pendantBodyGeometry?.dispose();
      pendantLoopGeometry?.dispose();
    };
  }, [ringGeometry, braceletGeometry, pendantBodyGeometry, pendantLoopGeometry]);

  if (category === "ring" && ringBuild && ringGeometry) {
    return (
      <group rotation={ringBuild.rotation} scale={[1, ringBuild.scaleZ, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={ringGeometry}
          userData={{ role: JEWELRY_BASE_FLAG }}
        >
          <JewelryMaterial hasHighDetail={hasWorkmat} />
        </mesh>
      </group>
    );
  }

  if (category === "bracelet" && braceletBuild && braceletGeometry) {
    return (
      <group rotation={braceletBuild.rotation} scale={[1, braceletBuild.scaleZ, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={braceletGeometry}
          userData={{ role: JEWELRY_BASE_FLAG }}
        >
          <JewelryMaterial hasHighDetail={hasWorkmat} />
        </mesh>
      </group>
    );
  }

  if (category === "pendant" && pendantBuild && pendantBodyGeometry && pendantLoopGeometry) {
    const loopY = pendantBuild.body.height * 0.45;
    return (
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={pendantBodyGeometry}
          userData={{ role: JEWELRY_BASE_FLAG }}
        >
          <JewelryMaterial hasHighDetail={hasWorkmat} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={pendantLoopGeometry}
          position={[0, loopY, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          userData={{ role: JEWELRY_BASE_FLAG }}
        >
          <JewelryMaterial />
        </mesh>
      </group>
    );
  }

  return null;
}

export const BaseJewelryMesh = memo(BaseJewelryMeshInner);
