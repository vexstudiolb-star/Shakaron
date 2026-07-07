import * as THREE from "three";
import type { HeadStyle, ShankStyle } from "./asset-catalog";

export type JewelryLayer =
  | "metal_bands"
  | "gem_prongs"
  | "stones_primary"
  | "stones_accent";

export type ParsedCadLayers = {
  root: THREE.Group;
  shankVariants: Record<string, THREE.Object3D>;
  headVariants: Record<string, THREE.Object3D>;
  metalBands: THREE.Mesh[];
  gemProngs: THREE.Mesh[];
  stonesPrimary: THREE.Mesh[];
  stonesAccent: THREE.Mesh[];
};

function inferLayer(name: string, userData: Record<string, unknown>): JewelryLayer | null {
  const tagged = userData.layer as string | undefined;
  if (tagged === "metal_bands") return "metal_bands";
  if (tagged === "gem_prongs") return "gem_prongs";
  if (tagged === "stones_primary") return "stones_primary";
  if (tagged === "stones_accent") return "stones_accent";

  const lower = name.toLowerCase();
  if (lower.startsWith("metal_bands")) return "metal_bands";
  if (lower.startsWith("gem_prongs")) return "gem_prongs";
  if (lower.startsWith("stones_primary")) return "stones_primary";
  if (lower.startsWith("stones_accent")) return "stones_accent";
  return null;
}

function collectMeshes(object: THREE.Object3D, layer: JewelryLayer, out: THREE.Mesh[]) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const role = inferLayer(child.name, child.userData as Record<string, unknown>);
    if (role === layer) out.push(child);
  });
}

function variantFromMeshName(name: string, prefix: string): string | null {
  if (!name.startsWith(prefix)) return null;
  return name.slice(prefix.length).split(/[_\s]/)[0] || null;
}

export function parseCadScene(scene: THREE.Group): ParsedCadLayers {
  const shankVariants: Record<string, THREE.Object3D> = {};
  const headVariants: Record<string, THREE.Object3D> = {};
  const metalBands: THREE.Mesh[] = [];
  const gemProngs: THREE.Mesh[] = [];
  const stonesPrimary: THREE.Mesh[] = [];
  const stonesAccent: THREE.Mesh[] = [];

  scene.traverse((child) => {
    const ud = child.userData as Record<string, unknown>;
    if (ud.kind === "shank" && ud.variant) {
      shankVariants[String(ud.variant)] = child;
    }
    if (ud.kind === "head" && ud.variant) {
      headVariants[String(ud.variant)] = child;
    }
    if (child.name.startsWith("shank_") && (child.type === "Group" || child.type === "Object3D")) {
      shankVariants[child.name.replace("shank_", "")] = child;
    }
    if (child.name.startsWith("head_") && (child.type === "Group" || child.type === "Object3D")) {
      headVariants[child.name.replace("head_", "")] = child;
    }
  });

  collectMeshes(scene, "metal_bands", metalBands);
  collectMeshes(scene, "gem_prongs", gemProngs);
  collectMeshes(scene, "stones_primary", stonesPrimary);
  collectMeshes(scene, "stones_accent", stonesAccent);

  return {
    root: scene,
    shankVariants,
    headVariants,
    metalBands,
    gemProngs,
    stonesPrimary,
    stonesAccent,
  };
}

/** Supports grouped CAD exports and flattened GLB meshes (metal_bands__shank_straight, etc.). */
export function applyCadVisibility(
  layers: ParsedCadLayers,
  shankStyle: ShankStyle,
  headStyle: HeadStyle | null
) {
  const hasGroups = Object.keys(layers.shankVariants).length > 0;

  if (hasGroups) {
    Object.entries(layers.shankVariants).forEach(([key, node]) => {
      node.visible = key === shankStyle;
    });
    Object.entries(layers.headVariants).forEach(([key, node]) => {
      node.visible = headStyle ? key === headStyle : false;
    });
    return;
  }

  layers.metalBands.forEach((mesh) => {
    const shank =
      variantFromMeshName(mesh.name, "metal_bands__shank_") ??
      variantFromMeshName(mesh.name, "metal_bands__pendant_") ??
      variantFromMeshName(mesh.name, "metal_bands__bracelet_");
    if (shank) mesh.visible = shank === shankStyle;
  });

  layers.gemProngs.forEach((mesh) => {
    const head = variantFromMeshName(mesh.name, "gem_prongs__head_");
    const bail = variantFromMeshName(mesh.name, "gem_prongs__bail_");
    if (head) mesh.visible = headStyle ? head === headStyle : false;
    else if (bail) mesh.visible = bail === shankStyle;
  });

  layers.stonesPrimary.forEach((mesh) => {
    const variant = mesh.name.replace("stones_primary__", "");
    if (!variant || variant === mesh.name) return;
    if (headStyle) mesh.visible = variant === headStyle;
    else mesh.visible = variant === shankStyle;
  });

  layers.stonesAccent.forEach((mesh) => {
    if (!headStyle) {
      mesh.visible = false;
      return;
    }
    const variant = mesh.name.replace("stones_accent__", "");
    mesh.visible = variant.includes(headStyle) || variant === headStyle;
  });
}

export function cloneForExport(root: THREE.Object3D): THREE.Group {
  const clone = root.clone(true);

  function effectivelyVisible(obj: THREE.Object3D) {
    let current: THREE.Object3D | null = obj;
    while (current) {
      if (!current.visible) return false;
      current = current.parent;
    }
    return true;
  }

  const removeQueue: THREE.Object3D[] = [];
  clone.traverse((child) => {
    if (!effectivelyVisible(child)) removeQueue.push(child);
  });

  removeQueue
    .sort((a, b) => {
      const depth = (node: THREE.Object3D) => {
        let d = 0;
        let p: THREE.Object3D | null = node;
        while (p) {
          d++;
          p = p.parent;
        }
        return d;
      };
      return depth(b) - depth(a);
    })
    .forEach((node) => node.parent?.remove(node));

  return clone as THREE.Group;
}
