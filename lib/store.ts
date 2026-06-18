import "server-only";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { Category } from "@/data/site";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function getCategories(): Promise<Category[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Category[];
}

async function saveCategories(cats: Category[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(cats, null, 2), "utf-8");
}

export async function totals() {
  const cats = await getCategories();
  return {
    products: cats.reduce((n, c) => n + c.products.length, 0),
    categories: cats.length,
  };
}

/** Save an uploaded image into /public/products/<slug>/ and register it. */
export async function addProduct(
  slug: string,
  title: string,
  fileName: string,
  buffer: Buffer
) {
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) throw new Error("القسم غير موجود");

  // Always optimize uploads for the web (max 1600px, progressive JPEG) so big
  // camera photos never bloat the site or crash image optimization.
  const optimized = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();

  const unique = `${slug}-${Date.now()}-${Math.floor(
    (buffer.length % 9000) + 1000
  )}.jpg`;

  const dir = path.join(PUBLIC_DIR, "products", slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, unique), optimized);

  const image = `/products/${slug}/${unique}`;
  cat.products.push({ title: title?.trim() || "تابلوه جديد", image });
  await saveCategories(cats);
  return { image };
}

/** Remove a product from JSON and delete its image file. */
export async function deleteProduct(slug: string, image: string) {
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) throw new Error("القسم غير موجود");

  cat.products = cat.products.filter((p) => p.image !== image);
  await saveCategories(cats);

  // delete the physical file (ignore if missing); guard against path escapes
  const rel = image.replace(/^\/+/, "");
  const abs = path.join(PUBLIC_DIR, rel);
  if (abs.startsWith(PUBLIC_DIR + path.sep)) {
    await fs.unlink(abs).catch(() => {});
  }
}
