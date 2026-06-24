// Migrate all files in the `products` storage bucket from the OLD Supabase
// project to the NEW one, preserving the exact folder/file paths so the
// already-updated image_url values keep working.
//
// Run from the project root:  node scripts/migrate-storage.mjs
//
// Set the OLD_/NEW_ values in .env.local before running.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// CONFIG — read from .env.local (gitignored). Set these 4 keys there:
//   OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY, NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY
const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (m) env[m[1].trim()] = m[2].trim();
}
const OLD_URL = env.OLD_SUPABASE_URL;
const OLD_SERVICE_KEY = env.OLD_SUPABASE_SERVICE_KEY;
const NEW_URL = env.NEW_SUPABASE_URL;
const NEW_SERVICE_KEY = env.NEW_SUPABASE_SERVICE_KEY;
const BUCKET = "products";
if (!OLD_URL || !OLD_SERVICE_KEY || !NEW_URL || !NEW_SERVICE_KEY)
  throw new Error("Missing OLD_/NEW_ SUPABASE_URL & SERVICE_KEY in .env.local");
// ---------------------------------------------------------------------------

const oldSb = createClient(OLD_URL, OLD_SERVICE_KEY, { auth: { persistSession: false } });
const newSb = createClient(NEW_URL, NEW_SERVICE_KEY, { auth: { persistSession: false } });

// recursively list every file under a prefix
async function listAll(sb, prefix = "") {
  const out = [];
  const { data, error } = await sb.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw new Error(`list "${prefix}" failed: ${error.message}`);
  for (const item of data || []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      // it's a folder → recurse
      const nested = await listAll(sb, path);
      out.push(...nested);
    } else {
      out.push(path);
    }
  }
  return out;
}

const ctype = (f) =>
  /\.png$/i.test(f) ? "image/png" :
  /\.webp$/i.test(f) ? "image/webp" :
  /\.gif$/i.test(f) ? "image/gif" :
  "image/jpeg";

console.log("listing files in OLD bucket…");
const files = await listAll(oldSb);
console.log(`found ${files.length} files.\n`);

let ok = 0, failed = 0;
for (const path of files) {
  // download from old
  const { data: blob, error: de } = await oldSb.storage.from(BUCKET).download(path);
  if (de) {
    console.error("  download failed:", path, de.message);
    failed++;
    continue;
  }
  const buffer = Buffer.from(await blob.arrayBuffer());
  // upload to new (upsert so re-runs are safe)
  const { error: ue } = await newSb.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: ctype(path), upsert: true });
  if (ue) {
    console.error("  upload failed:", path, ue.message);
    failed++;
    continue;
  }
  ok++;
  console.log(`  ✓ ${path}`);
}

console.log(`\nDONE: ${ok} copied, ${failed} failed.`);
