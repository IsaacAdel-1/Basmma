// One-off: import the current data/products.json + public/products images
// into Supabase (categories + products tables, and the `products` storage bucket).
// Idempotent: wipes categories/products + bucket first, then re-imports.
//
// Run from the project root:  node scripts/migrate-to-supabase.mjs
import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename } from "node:path";

// --- load env from .env.local (node doesn't auto-load it) ---
const env = {};
for (const line of (await readFile(".env.local", "utf8")).split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) throw new Error("missing Supabase env vars in .env.local");

const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BUCKET = "products";
const ctype = (f) => (/\.png$/i.test(f) ? "image/png" : "image/jpeg");

// --- 1) wipe existing data so re-runs are clean ---
console.log("clearing existing categories/products + storage…");
await sb.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
await sb.from("categories").delete().neq("slug", "__none__");
// empty the bucket (list per top-level folder, then remove)
const { data: folders } = await sb.storage.from(BUCKET).list("", { limit: 1000 });
for (const f of folders || []) {
  if (!f.id && f.name) {
    const { data: files } = await sb.storage.from(BUCKET).list(f.name, { limit: 1000 });
    const keys = (files || []).map((x) => `${f.name}/${x.name}`);
    if (keys.length) await sb.storage.from(BUCKET).remove(keys);
  }
}

// --- 2) import categories + products ---
const data = JSON.parse(await readFile("data/products.json", "utf8"));
let nCat = 0,
  nProd = 0,
  failed = 0;

for (let ci = 0; ci < data.length; ci++) {
  const c = data[ci];
  const { error: ce } = await sb.from("categories").insert({
    slug: c.slug,
    title: c.title,
    blurb: c.blurb || "",
    position: ci,
  });
  if (ce) {
    console.error("category failed:", c.slug, ce.message);
    continue;
  }
  nCat++;

  for (let pi = 0; pi < c.products.length; pi++) {
    const p = c.products[pi];
    const localPath = join("public", p.image.replace(/^\/+/, ""));
    if (!existsSync(localPath)) {
      console.error("  image missing on disk:", p.image);
      failed++;
      continue;
    }
    const key = `${c.slug}/${basename(p.image)}`;
    const body = await readFile(localPath);
    const { error: ue } = await sb.storage
      .from(BUCKET)
      .upload(key, body, { contentType: ctype(p.image), upsert: true });
    if (ue) {
      console.error("  upload failed:", key, ue.message);
      failed++;
      continue;
    }
    const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(key);
    const { error: pe } = await sb.from("products").insert({
      category_slug: c.slug,
      title: p.title,
      image_url: pub.publicUrl,
      width: p.width ?? null,
      height: p.height ?? null,
      position: pi,
    });
    if (pe) {
      console.error("  product row failed:", p.title, pe.message);
      failed++;
      continue;
    }
    nProd++;
  }
  console.log(`✓ ${c.title} — ${c.products.length} products`);
}

console.log(`\nDONE: ${nCat} categories, ${nProd} products imported, ${failed} failed.`);
