// One-off: compress the 4 new raw "girls" photos to web-sized girls-1..4.jpg,
// move the raw originals out to _Basmaya-RawData, and update products.json titles.
import sharp from "sharp";
import { readFile, writeFile, mkdir, rename, readdir } from "node:fs/promises";
import { join } from "node:path";

const DIR = "public/products/girls";
const RAW_BACKUP = "../_Basmaya-RawData/girls-originals";
const MAX = 1600;
const QUALITY = 82;

// raw file (by keyword match) -> [output basename, product title]
const MAP = [
  { match: "انت-جميلة", out: "girls-1.jpg", title: "أنتِ جميلة" },
  { match: "تغنى-كايام", out: "girls-2.jpg", title: "تغني كأيام صباها" },
  { match: "كلك-جميل", out: "girls-3.jpg", title: "كلّك جميل" },
  { match: "جميل ياجبيبتى", out: "girls-4.jpg", title: "جميل يا حبيبتي" },
];

const fmt = (b) => (b / 1024 / 1024).toFixed(1) + "MB";

await mkdir(RAW_BACKUP, { recursive: true });

const files = await readdir(DIR);
const products = [];

for (const { match, out, title } of MAP) {
  const raw = files.find((f) => f.includes(match));
  if (!raw) {
    console.error("!! raw not found for:", match);
    continue;
  }
  const src = join(DIR, raw);
  const dst = join(DIR, out);
  const buf = await readFile(src);
  await sharp(buf, { failOn: "none" })
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(dst);
  await rename(src, join(RAW_BACKUP, raw)); // preserve original outside project
  console.log(`${raw}  ${fmt(buf.length)} -> ${out}`);
  products.push({ title, image: `/products/girls/${out}` });
}

// update products.json
const jsonPath = "data/products.json";
const data = JSON.parse(await readFile(jsonPath, "utf8"));
const cat = data.find((c) => c.slug === "girls");
cat.products = products;
await writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("\nupdated girls products:", products.length);
