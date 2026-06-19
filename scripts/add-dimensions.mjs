// One-off: backfill natural width/height for every product image in products.json
// so cards can size to each image's real shape.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const jsonPath = "data/products.json";
const data = JSON.parse(await readFile(jsonPath, "utf8"));

let done = 0;
let missing = 0;

for (const cat of data) {
  for (const p of cat.products) {
    const file = join("public", p.image.replace(/^\/+/, ""));
    try {
      const m = await sharp(file).metadata();
      p.width = m.width;
      p.height = m.height;
      done++;
    } catch {
      console.error("!! could not read", file);
      missing++;
    }
  }
}

await writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`added dimensions to ${done} products (${missing} missing)`);
