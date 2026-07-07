"use client";

import { memo, useEffect, useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import {
  CAD_ASSET_URLS,
  defaultShankForCategory,
} from "@/lib/configurator/asset-catalog";
import { applyCadVisibility, parseCadScene } from "@/lib/configurator/asset-parser";
import {
  GEMSTONE_PRESETS,
  LUXURY_METAL_PRESETS,
  resolveMetalRoughness,
} from "@/lib/configurator/material-engine";
import {
  createWorkmatTexture,
  disposeTexture,
  getDisplacementSettings,
} from "@/lib/configurator/workmat-engine";

function createGemMaterial(gemPreset: (typeof GEMSTONE_PRESETS)["diamond"]) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: gemPreset.color,
    metalness: 0,
    roughness: 0,
    transmission: 1,
    thickness: 0.55,
    ior: gemPreset.ior,
    attenuationColor: new THREE.Color(gemPreset.absorption),
    attenuationDistance: 0.8,
    transparent: true,
  });

  if ("dispersion" in mat) {
    (mat as THREE.MeshPhysicalMaterial & { dispersion: number }).dispersion =
      gemPreset.dispersion;
  }

  return mat;
}

function CadJewelryModelInner() {
  const {
    category,
    activeMetal,
    metalFinish,
    shankStyle,
    headStyle,
    primaryGem,
    engraveMode,
    workmat,
  } = useConfigurator();

  const url = CAD_ASSET_URLS[category];
  const { scene } = useGLTF(url);

  useEffect(() => {
    Object.values(CAD_ASSET_URLS).forEach((assetUrl) => useGLTF.preload(assetUrl));
  }, []);

  const cloned = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return root;
  }, [scene]);

  const layers = useMemo(() => parseCadScene(cloned as THREE.Group), [cloned]);

  const workmatTexture = useMemo(() => createWorkmatTexture(workmat), [workmat]);
  useEffect(() => () => disposeTexture(workmatTexture ?? undefined), [workmatTexture]);

  const activeHead = category === "ring" ? headStyle : null;
  const activeShank = shankStyle || defaultShankForCategory(category);

  useLayoutEffect(() => {
    applyCadVisibility(layers, activeShank, activeHead);
  }, [layers, activeShank, activeHead]);

  useLayoutEffect(() => {
    const metalPreset = LUXURY_METAL_PRESETS[activeMetal];
    const roughness = resolveMetalRoughness(metalFinish, metalPreset.roughness);
    const displacement = getDisplacementSettings(engraveMode, Boolean(workmatTexture));
    const gemPreset = GEMSTONE_PRESETS[primaryGem];

    layers.metalBands.forEach((mesh) => {
      mesh.material = new THREE.MeshStandardMaterial({
        color: metalPreset.color,
        metalness: metalPreset.metalness,
        roughness,
        bumpMap: workmatTexture ?? undefined,
        bumpScale: displacement.bumpScale,
        displacementMap: workmatTexture ?? undefined,
        displacementScale: displacement.displacementScale,
        displacementBias: displacement.displacementBias,
      });
    });

    layers.gemProngs.forEach((mesh) => {
      mesh.material = new THREE.MeshStandardMaterial({
        color: metalPreset.color,
        metalness: metalPreset.metalness,
        roughness: roughness * 0.9,
      });
    });

    const gemMaterial = createGemMaterial(gemPreset);
    layers.stonesPrimary.forEach((mesh) => {
      mesh.material = gemMaterial.clone();
    });
    layers.stonesAccent.forEach((mesh) => {
      mesh.material = gemMaterial.clone();
    });
  }, [layers, activeMetal, metalFinish, primaryGem, engraveMode, workmatTexture]);

  return <primitive object={cloned} scale={1.15} position={[0, -0.05, 0]} />;
}

export const CadJewelryModel = memo(CadJewelryModelInner);
