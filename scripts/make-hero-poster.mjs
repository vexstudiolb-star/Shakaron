import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../public/hero-poster.jpg");
const svg = Buffer.from(
  `<svg width="1280" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stop-color="#3a3224"/>
        <stop offset="55%" stop-color="#1a1612"/>
        <stop offset="100%" stop-color="#0c0c0c"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`
);

const info = await sharp(svg).jpeg({ quality: 72, mozjpeg: true }).toFile(out);
console.log("wrote", out, info.size);
