// One-off: shrink the huge raw product photos in public/products to web sizes.
// Originals are preserved separately in _Basmaya-RawData (moved out of the project).
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = "public/products";
const MAX = 1600; // longest edge in px
const QUALITY = 82;

const fmt = (b) => (b / 1024 / 1024).toFixed(1) + "MB";

async function listImages(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await listImages(p)));
    else if (/\.(jpe?g|png)$/i.test(name)) out.push(p);
  }
  return out;
}

const files = await listImages(ROOT);
let before = 0;
let after = 0;

for (const file of files) {
  const tmp = file + ".tmp";
  const orig = (await stat(file)).size;
  before += orig;
  await sharp(file, { failOn: "none" })
    .rotate() // respect EXIF orientation
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp);
  await unlink(file);
  // always end up as .jpg
  const finalPath = extname(file).toLowerCase() === ".jpg" ? file : file.replace(/\.(jpe?g|png)$/i, ".jpg");
  await rename(tmp, finalPath);
  const now = (await stat(finalPath)).size;
  after += now;
  console.log(`${file}  ${fmt(orig)} -> ${fmt(now)}`);
}

console.log(`\nTOTAL: ${fmt(before)} -> ${fmt(after)}  (${files.length} images)`);
