import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

/**
 * Server-only admin client (uses the secret key → bypasses RLS).
 * Never import this from a client component.
 */
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const STORAGE_BUCKET = "products";

/** derive the storage object key from a public image URL */
export function objectKeyFromUrl(imageUrl: string): string | null {
  const marker = `/object/public/${STORAGE_BUCKET}/`;
  const i = imageUrl.indexOf(marker);
  return i === -1 ? null : imageUrl.slice(i + marker.length);
}
