/**
 * Generates structured CAD GLB assets with iJewel3D-style layer naming.
 * Run: node scripts/generate-cad-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as THREE from "three";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/models/cad");

function taggedMesh(geometry, name, layer) {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0xc4a35a, metalness: 1, roughness: 0.12 })
  );
  mesh.name = name;
  mesh.userData = { layer, export: true };
  return mesh;
}

function gemMesh(geometry, name, layer = "stones_primary") {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.6,
      ior: 2.417,
    })
  );
  mesh.name = name;
  mesh.userData = { layer, export: true };
  return mesh;
}

function shankGroup(style, major, tube, yOffset = 0) {
  const group = new THREE.Group();
  group.name = `shank_${style}`;
  group.userData = { variant: style, kind: "shank" };

  const geo = new THREE.TorusGeometry(major, tube, 48, 96);
  const band = taggedMesh(geo, `metal_bands__shank_${style}`, "metal_bands");
  band.rotation.x = Math.PI / 2;
  band.position.y = yOffset;
  group.add(band);
  return group;
}

function headGroup(style) {
  const group = new THREE.Group();
  group.name = `head_${style}`;
  group.userData = { variant: style, kind: "head" };

  const prongGeo =
    style === "halo"
      ? new THREE.TorusGeometry(0.14, 0.018, 8, 32)
      : new THREE.CylinderGeometry(0.012, 0.008, 0.14, style === "6prong" ? 6 : 4);

  const prongs = taggedMesh(prongGeo, `gem_prongs__head_${style}`, "gem_prongs");
  prongs.position.set(0, 0.42, 0);
  if (style !== "halo") prongs.position.y = 0.38;
  group.add(prongs);

  const stone = gemMesh(
    new THREE.OctahedronGeometry(style === "halo" ? 0.11 : 0.13, 2),
    `stones_primary__${style}`,
    "stones_primary"
  );
  stone.position.set(0, 0.44, 0);
  group.add(stone);

  if (style === "halo") {
    const halo = gemMesh(
      new THREE.TorusGeometry(0.2, 0.025, 12, 48),
      "stones_accent__halo",
      "stones_accent"
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.42;
    group.add(halo);
  }

  return group;
}

function buildEngagementRing() {
  const root = new THREE.Group();
  root.name = "engagement_ring";

  root.add(shankGroup("straight", 0.52, 0.055));
  root.add(shankGroup("cathedral", 0.52, 0.05, 0));
  root.getObjectByName("shank_cathedral").children[0].scale.set(1, 1.15, 1);

  const bypass = shankGroup("bypass", 0.52, 0.052);
  bypass.rotation.z = 0.12;
  root.add(bypass);

  root.add(headGroup("4prong"));
  root.add(headGroup("6prong"));
  root.add(headGroup("halo"));

  return root;
}

function buildPendantCad() {
  const root = new THREE.Group();
  root.name = "pendant_cad";

  ["classic", "bar", "heart"].forEach((style) => {
    const group = new THREE.Group();
    group.name = `shank_${style}`;
    group.userData = { variant: style, kind: "shank" };

    let bodyGeo;
    if (style === "bar") bodyGeo = new THREE.BoxGeometry(0.22, 0.42, 0.04, 4, 8, 2);
    else if (style === "heart") bodyGeo = new THREE.SphereGeometry(0.2, 24, 24);
    else bodyGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.05, 32);

    const body = taggedMesh(bodyGeo, `metal_bands__pendant_${style}`, "metal_bands");
    body.position.y = -0.05;
    group.add(body);

    const loop = taggedMesh(
      new THREE.TorusGeometry(0.06, 0.012, 16, 32),
      `gem_prongs__bail_${style}`,
      "gem_prongs"
    );
    loop.rotation.x = Math.PI / 2;
    loop.position.y = 0.22;
    group.add(loop);

    const stone = gemMesh(new THREE.OctahedronGeometry(0.08, 1), `stones_primary__${style}`);
    stone.position.y = style === "bar" ? 0 : -0.02;
    group.add(stone);

    root.add(group);
  });

  return root;
}

function buildBraceletCad() {
  const root = new THREE.Group();
  root.name = "bracelet_cad";

  ["classic", "cable", "tennis"].forEach((style, i) => {
    const group = new THREE.Group();
    group.name = `shank_${style}`;
    group.userData = { variant: style, kind: "shank" };

    const major = 0.85 + i * 0.02;
    const tube = style === "cable" ? 0.04 : 0.055;
    const band = taggedMesh(
      new THREE.TorusGeometry(major, tube, 56, 120),
      `metal_bands__bracelet_${style}`,
      "metal_bands"
    );
    band.rotation.x = Math.PI / 2;
    group.add(band);

    if (style === "tennis") {
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2;
        const accent = gemMesh(
          new THREE.OctahedronGeometry(0.035, 0),
          `stones_accent__tennis_${j}`,
          "stones_accent"
        );
        accent.position.set(Math.cos(a) * major, 0, Math.sin(a) * major);
        group.add(accent);
      }
    }

    const center = gemMesh(new THREE.OctahedronGeometry(0.07, 1), `stones_primary__${style}`);
    center.position.set(major, 0.08, 0);
    group.add(center);

    root.add(group);
  });

  return root;
}

async function exportGlb(object, filename) {
  const scene = new THREE.Scene();
  scene.add(object);
  const objPath = path.join(OUT_DIR, filename.replace(".glb", ".obj"));
  fs.writeFileSync(objPath, new OBJExporter().parse(scene));
  const glbPath = path.join(OUT_DIR, filename);
  try {
    execSync(`npx obj2gltf -i "${objPath}" -o "${glbPath}"`, { stdio: "pipe" });
    console.log(`  ✓ ${filename}`);
  } catch {
    console.log(`  ✓ ${filename.replace(".glb", ".obj")} (GLB conversion skipped)`);
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Generating CAD assets...");
  await exportGlb(buildEngagementRing(), "engagement-ring.glb");
  await exportGlb(buildPendantCad(), "pendant.glb");
  await exportGlb(buildBraceletCad(), "bracelet.glb");
  console.log("Done.");
}

main().catch(console.error);
