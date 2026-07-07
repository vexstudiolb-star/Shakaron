"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { nextNodeId } from "@/lib/configurator/types";
import { JEWELRY_BASE_FLAG } from "./JewelryMaterial";

export function SurfaceStampHandler() {
  const { camera, scene, gl } = useThree();
  const { stampTool, addAccessory } = useConfigurator();

  useEffect(() => {
    gl.domElement.style.cursor = stampTool === "orbit" ? "grab" : "crosshair";
  }, [gl, stampTool]);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();

    function onPointerDown(event: PointerEvent) {
      if (stampTool === "orbit") return;

      const rect = gl.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      const hit = hits.find((h) => {
        const ud = h.object.userData as Record<string, unknown>;
        return ud?.layer === "metal_bands" || ud?.role === JEWELRY_BASE_FLAG;
      });
      if (!hit?.face) return;

      const normal = hit.face.normal
        .clone()
        .transformDirection(hit.object.matrixWorld)
        .normalize();
      const position = hit.point.clone().addScaledVector(normal, 0.02);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      addAccessory({
        id: nextNodeId("stamp"),
        type: stampTool === "gem" ? "gem" : "ornament",
        position: [position.x, position.y, position.z],
        rotation: [euler.x, euler.y, euler.z],
        scale: stampTool === "gem" ? 1 : 0.85,
      });
    }

    gl.domElement.addEventListener("pointerdown", onPointerDown);
    return () => gl.domElement.removeEventListener("pointerdown", onPointerDown);
  }, [stampTool, addAccessory, camera, scene, gl]);

  return null;
}
