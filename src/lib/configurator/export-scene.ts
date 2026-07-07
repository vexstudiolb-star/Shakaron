import * as THREE from "three";
import type { Object3D } from "three";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { cloneForExport } from "./asset-parser";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Clone active configuration, strip hidden variant nodes, export unified mesh tree. */
export function prepareExportRoot(object: Object3D): THREE.Group {
  const exportRoot = cloneForExport(object);
  exportRoot.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if ("map" in mat && mat.map) mat.map.needsUpdate = true;
        if ("bumpMap" in mat && mat.bumpMap) mat.bumpMap.needsUpdate = true;
        if ("displacementMap" in mat && mat.displacementMap) mat.displacementMap.needsUpdate = true;
      });
    }
  });
  return exportRoot;
}

export function exportSceneToObj(
  object: Object3D,
  filename = "jewelry-design.obj"
): boolean {
  if (!object) return false;
  const root = prepareExportRoot(object);
  const payload = new OBJExporter().parse(root);
  triggerDownload(new Blob([payload], { type: "text/plain" }), filename);
  return true;
}

export function exportSceneToGltf(
  object: Object3D,
  filename = "jewelry-design.glb"
): Promise<boolean> {
  if (!object) return Promise.resolve(false);
  const root = prepareExportRoot(object);

  return new Promise((resolve) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      root,
      (result) => {
        if (result instanceof ArrayBuffer) {
          triggerDownload(new Blob([result], { type: "model/gltf-binary" }), filename);
          resolve(true);
          return;
        }
        const json = JSON.stringify(result);
        triggerDownload(
          new Blob([json], { type: "model/gltf+json" }),
          filename.replace(".glb", ".gltf")
        );
        resolve(true);
      },
      () => resolve(false),
      { binary: true }
    );
  });
}
