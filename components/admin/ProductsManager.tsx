"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Category } from "@/data/site";

export default function ProductsManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState(categories[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [deleting, setDeleting] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg({ t: "اختار صورة الأول", ok: false });
      return;
    }
    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("title", title);
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && j.ok) {
      setMsg({ t: "تمت الإضافة بنجاح ✅", ok: true });
      setTitle("");
      pickFile(null);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } else {
      setMsg({ t: j.error || "حصل خطأ", ok: false });
    }
  }

  async function remove(catSlug: string, image: string, name: string) {
    if (!confirm(`متأكد إنك عايز تحذف «${name}»؟`)) return;
    setDeleting(image);
    const res = await fetch("/api/admin/product", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: catSlug, image }),
    });
    setDeleting("");
    if (res.ok) router.refresh();
    else {
      const j = await res.json().catch(() => ({}));
      setMsg({ t: j.error || "تعذّر الحذف", ok: false });
    }
  }

  return (
    <div className="grid gap-8">
      {/* upload form */}
      <form
        onSubmit={upload}
        className="grid gap-4 rounded-xl2 border border-line bg-white p-6 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-2">القسم</label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-wine"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-2">اسم التصميم (اختياري)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: صلاة السكينة"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-wine"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-ink-2">الصورة</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-wine file:px-4 file:py-2 file:font-bold file:text-white"
          />
        </div>
        <div className="flex items-center gap-4">
          {preview && (
            <img src={preview} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />
          )}
          <button type="submit" disabled={busy} className="btn btn-primary justify-center disabled:opacity-60">
            {busy ? "جاري الرفع…" : "أضف الصورة"}
          </button>
        </div>
        {msg && (
          <p
            className={`md:col-span-3 rounded-lg px-3 py-2 text-sm font-bold ${
              msg.ok ? "bg-green-100 text-green-700" : "bg-red-brand/10 text-red-brand"
            }`}
          >
            {msg.t}
          </p>
        )}
      </form>

      {/* products grid by category */}
      {categories.map((c) => (
        <div key={c.slug}>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-ink">{c.title}</h3>
            <span className="rounded-full bg-cream px-3 py-0.5 text-xs font-bold text-wine">
              {c.products.length}
            </span>
          </div>
          {c.products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-gray-brand">
              مفيش تصاميم في القسم ده — ضيف من فوق.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {c.products.map((p) => (
                <figure key={p.image} className="group overflow-hidden rounded-xl border border-line bg-white">
                  <div className="relative aspect-square bg-cream-2 p-2">
                    <div className="relative h-full w-full">
                      <Image src={p.image} alt={p.title} fill sizes="200px" className="object-contain" />
                    </div>
                  </div>
                  <figcaption className="flex items-center justify-between gap-1 p-2">
                    <span className="truncate text-xs font-bold text-ink-2">{p.title}</span>
                    <button
                      onClick={() => remove(c.slug, p.image, p.title)}
                      disabled={deleting === p.image}
                      className="shrink-0 rounded-md bg-red-brand/10 px-2 py-1 text-xs font-bold text-red-brand transition hover:bg-red-brand hover:text-white disabled:opacity-50"
                    >
                      {deleting === p.image ? "…" : "حذف"}
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
