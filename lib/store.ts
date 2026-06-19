import "server-only";
import { supabaseAdmin, STORAGE_BUCKET, objectKeyFromUrl } from "./supabase";
import type { Category } from "@/data/site";

/** Read all categories with their products, grouped & ordered. */
export async function getCategories(): Promise<Category[]> {
  const [{ data: cats, error: ce }, { data: prods, error: pe }] = await Promise.all([
    supabaseAdmin
      .from("categories")
      .select("slug,title,blurb,position,created_at")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("products")
      .select("category_slug,title,image_url,width,height,position,created_at")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  if (ce) throw new Error(ce.message);
  if (pe) throw new Error(pe.message);

  return (cats || []).map((c) => ({
    slug: c.slug,
    title: c.title,
    blurb: c.blurb || "",
    products: (prods || [])
      .filter((p) => p.category_slug === c.slug)
      .map((p) => ({
        title: p.title,
        image: p.image_url,
        width: p.width ?? undefined,
        height: p.height ?? undefined,
      })),
  }));
}

/* ----------------------------- categories ----------------------------- */

export async function addCategory(title: string, blurb: string) {
  const t = title?.trim();
  if (!t) throw new Error("اكتب اسم القسم");

  const { data: dup } = await supabaseAdmin
    .from("categories")
    .select("slug")
    .eq("title", t)
    .maybeSingle();
  if (dup) throw new Error("فيه قسم بنفس الاسم بالفعل");

  const { data: top } = await supabaseAdmin
    .from("categories")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const slug = `cat-${Date.now().toString(36)}`;
  const { error } = await supabaseAdmin.from("categories").insert({
    slug,
    title: t,
    blurb: blurb?.trim() || "",
    position: (top?.position ?? 0) + 1,
  });
  if (error) throw new Error(error.message);
  return { slug };
}

export async function updateCategory(slug: string, title: string, blurb: string) {
  const t = title?.trim();
  if (!t) throw new Error("اكتب اسم القسم");

  const { data: dup } = await supabaseAdmin
    .from("categories")
    .select("slug")
    .eq("title", t)
    .neq("slug", slug)
    .maybeSingle();
  if (dup) throw new Error("فيه قسم بنفس الاسم بالفعل");

  const { data: updated, error } = await supabaseAdmin
    .from("categories")
    .update({ title: t, blurb: blurb?.trim() || "" })
    .eq("slug", slug)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!updated) throw new Error("القسم غير موجود");
}

export async function deleteCategory(slug: string) {
  // remove every image of this category from storage first
  const { data: prods } = await supabaseAdmin
    .from("products")
    .select("image_url")
    .eq("category_slug", slug);

  const keys = (prods || [])
    .map((p) => objectKeyFromUrl(p.image_url))
    .filter((k): k is string => !!k);
  if (keys.length) await supabaseAdmin.storage.from(STORAGE_BUCKET).remove(keys);

  // deleting the category cascades to its product rows (FK ON DELETE CASCADE)
  const { error } = await supabaseAdmin.from("categories").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/* ------------------------------ products ------------------------------ */

/**
 * Store an already-compressed image (done in the browser) into Supabase
 * Storage and register the product row. `bytes` is the raw image data.
 */
export async function addProduct(
  slug: string,
  title: string,
  bytes: ArrayBuffer | Buffer,
  contentType: string,
  width?: number,
  height?: number
) {
  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (!cat) throw new Error("القسم غير موجود");

  const ext = contentType.includes("png") ? "png" : "jpg";
  const key = `${slug}/${slug}-${Date.now()}-${Math.floor(
    Math.random() * 9000 + 1000
  )}.${ext}`;

  const { error: ue } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(key, bytes, { contentType, upsert: false });
  if (ue) throw new Error(ue.message);

  const { data: pub } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  const image_url = pub.publicUrl;

  const { data: top } = await supabaseAdmin
    .from("products")
    .select("position")
    .eq("category_slug", slug)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabaseAdmin.from("products").insert({
    category_slug: slug,
    title: title?.trim() || "تابلوه جديد",
    image_url,
    width,
    height,
    position: (top?.position ?? 0) + 1,
  });
  if (error) {
    // roll back the uploaded file if the row insert failed
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([key]);
    throw new Error(error.message);
  }
  return { image: image_url };
}

export async function deleteProduct(slug: string, image: string) {
  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("category_slug", slug)
    .eq("image_url", image);
  if (error) throw new Error(error.message);

  const key = objectKeyFromUrl(image);
  if (key) await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([key]);
}
