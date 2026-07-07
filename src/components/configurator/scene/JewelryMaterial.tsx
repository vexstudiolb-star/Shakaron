"use client";

import { memo, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { METAL_MATERIALS } from "@/lib/configurator/metal-materials";
import {
  createWorkmatTexture,
  disposeTexture,
  getDisplacementSettings,
} from "@/lib/configurator/workmat-engine";

type JewelryMaterialProps = {
  hasHighDetail?: boolean;
};

function JewelryMaterialInner({ hasHighDetail = false }: JewelryMaterialProps) {
  const { activeMetal, engraveMode, workmat } = useConfigurator();

  const workmatTexture = useMemo(() => createWorkmatTexture(workmat), [workmat]);
  useEffect(() => () => disposeTexture(workmatTexture ?? undefined), [workmatTexture]);

  const metal = METAL_MATERIALS[activeMetal];
  const displacement = getDisplacementSettings(engraveMode, Boolean(workmatTexture));

  return (
    <meshStandardMaterial
      color={metal.color}
      metalness={metal.metalness}
      roughness={metal.roughness}
      bumpMap={workmatTexture ?? undefined}
      bumpScale={displacement.bumpScale}
      displacementMap={workmatTexture ?? undefined}
      displacementScale={displacement.displacementScale}
      displacementBias={displacement.displacementBias}
      flatShading={!hasHighDetail}
    />
  );
}

export const JewelryMaterial = memo(JewelryMaterialInner);

export const JEWELRY_BASE_FLAG = "jewelry-base";
