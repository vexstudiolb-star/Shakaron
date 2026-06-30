/**
 * Generates jewelry part models (OBJ + GLB) into public/models/jewelry/
 * Run: node scripts/generate-jewelry-models.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import * as THREE from "three";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/models/jewelry");

function heartShape(scale = 1) {
  const s = new THREE.Shape();
  const x = 0;
  const y = 0;
  s.moveTo(x, y + 0.5 * scale);
  s.bezierCurveTo(x, y + 0.5 * scale, x - 0.4 * scale, y + 0.5 * scale, x - 0.4 * scale, y);
  s.bezierCurveTo(x - 0.4 * scale, y - 0.35 * scale, x, y - 0.55 * scale, x, y - 0.75 * scale);
  s.bezierCurveTo(x, y - 0.55 * scale, x + 0.4 * scale, y - 0.35 * scale, x + 0.4 * scale, y);
  s.bezierCurveTo(x + 0.4 * scale, y + 0.5 * scale, x, y + 0.5 * scale, x, y + 0.5 * scale);
  return s;
}

function exportObj(baseName, object) {
  const scene = new THREE.Scene();
  scene.add(object);
  const obj = new OBJExporter().parse(scene);
  const objPath = path.join(OUT_DIR, `${baseName}.obj`);
  fs.writeFileSync(objPath, obj);

  const glbPath = path.join(OUT_DIR, `${baseName}.glb`);
  try {
    execSync(`npx obj2gltf -i "${objPath}" -o "${glbPath}"`, { stdio: "pipe" });
    console.log(`  ✓ ${baseName}.glb`);
  } catch {
    console.log(`  ✓ ${baseName}.obj (GLB conversion skipped)`);
  }
}

function mesh(geometry, name) {
  const m = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: 0xc4a35a, metalness: 0.9, roughness: 0.25 })
  );
  m.name = name;
  return m;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("Generating jewelry models...\n");

  exportObj("chain-cable-link", mesh(new THREE.TorusGeometry(0.18, 0.035, 16, 48), "CableLink"));

  const curb = new THREE.Group();
  curb.add(mesh(new THREE.BoxGeometry(0.14, 0.045, 0.08), "CurbLink"));
  exportObj("chain-curb-link", curb);

  exportObj(
    "chain-rope-link",
    mesh(new THREE.TorusKnotGeometry(0.12, 0.028, 64, 8, 2, 3), "RopeLink")
  );

  exportObj("chain-box-link", mesh(new THREE.TorusGeometry(0.17, 0.05, 4, 32), "BoxLink"));

  exportObj(
    "chain-necklace",
    mesh(new THREE.TorusGeometry(0.55, 0.03, 16, 80), "NecklaceChain")
  );

  exportObj(
    "pendant-disc",
    mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 48), "DiscPendant")
  );

  const heartGeo = new THREE.ExtrudeGeometry(heartShape(0.35), {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3,
  });
  heartGeo.center();
  exportObj("pendant-heart", mesh(heartGeo, "HeartPendant"));

  exportObj("pendant-bar", mesh(new THREE.BoxGeometry(0.45, 0.14, 0.04), "BarPendant"));

  const teardrop = new THREE.Group();
  const cone = mesh(new THREE.ConeGeometry(0.16, 0.32, 48), "TeardropCone");
  cone.position.y = -0.08;
  const sphere = mesh(new THREE.SphereGeometry(0.16, 32, 32), "TeardropGem");
  sphere.position.y = 0.12;
  teardrop.add(cone, sphere);
  exportObj("pendant-teardrop", teardrop);

  exportObj("ring-band", mesh(new THREE.TorusGeometry(0.28, 0.04, 24, 64), "RingBand"));
  exportObj("charm-gem", mesh(new THREE.OctahedronGeometry(0.12, 0), "GemCharm"));

  const clasp = new THREE.Group();
  const hook = mesh(new THREE.TorusGeometry(0.08, 0.018, 12, 32, Math.PI), "Hook");
  hook.rotation.z = Math.PI / 2;
  const bar = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 16), "Bar");
  bar.rotation.z = Math.PI / 2;
  bar.position.x = 0.1;
  clasp.add(hook, bar);
  exportObj("connector-clasp", clasp);

  const parts = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".glb") || f.endsWith(".obj"));

  const manifest = {
    version: 1,
    license: "CC0 — Shakaron Jewelry. Edit freely in Blender or any 3D tool.",
    folder: "/models/jewelry/",
    parts: parts.sort(),
  };
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${parts.length} files in public/models/jewelry/`);
}

main();
