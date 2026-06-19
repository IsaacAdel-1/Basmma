"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/site";

export default function CategoriesManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);

  // inline edit state
  const [editing, setEditing] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [editBlurb, setEditBlurb] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/category", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, blurb }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && j.ok) {
      setMsg({ t: "تم إنشاء القسم ✅", ok: true });
      setTitle("");
      setBlurb("");
      router.refresh();
    } else {
      setMsg({ t: j.error || "حصل خطأ", ok: false });
    }
  }

  function startEdit(c: Category) {
    setEditing(c.slug);
    setEditTitle(c.title);
    setEditBlurb(c.blurb);
  }

  async function saveEdit(slug: string) {
    const res = await fetch("/api/admin/category", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, title: editTitle, blurb: editBlurb }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && j.ok) {
      setEditing("");
      router.refresh();
    } else {
      setMsg({ t: j.error || "تعذّر الحفظ", ok: false });
    }
  }

  async function remove(c: Category) {
    if (
      !confirm(
        `متأكد إنك عايز تحذف قسم «${c.title}»؟ ده هيحذف ${c.products.length} صورة جواه ومش هينفع ترجعهم.`
      )
    )
      return;
    const res = await fetch("/api/admin/category", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug: c.slug }),
    });
    if (res.ok) router.refresh();
    else {
      const j = await res.json().catch(() => ({}));
      setMsg({ t: j.error || "تعذّر الحذف", ok: false });
    }
  }

  return (
    <div className="grid gap-8">
      {/* create new tab */}
      <form
        onSubmit={create}
        className="grid gap-4 rounded-xl2 border border-line bg-white p-6 md:grid-cols-[1fr_1.4fr_auto] md:items-end"
      >
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-2">
            اسم القسم الجديد (التاب)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تابلوهات الأطفال"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-wine"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-ink-2">
            وصف قصير (اختياري)
          </label>
          <input
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            placeholder="جملة بتظهر تحت اسم القسم"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none focus:border-wine"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary justify-center disabled:opacity-60"
        >
          {busy ? "جاري الإنشاء…" : "+ أضف قسم"}
        </button>
        {msg && (
          <p
            className={`rounded-lg px-3 py-2 text-sm font-bold md:col-span-3 ${
              msg.ok ? "bg-green-100 text-green-700" : "bg-red-brand/10 text-red-brand"
            }`}
          >
            {msg.t}
          </p>
        )}
      </form>

      {/* existing tabs */}
      <div className="grid gap-3">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="rounded-xl2 border border-line bg-white p-5"
          >
            {editing === c.slug ? (
              <div className="grid gap-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 font-bold outline-none focus:border-wine"
                />
                <input
                  value={editBlurb}
                  onChange={(e) => setEditBlurb(e.target.value)}
                  placeholder="وصف قصير"
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-wine"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(c.slug)}
                    className="rounded-full bg-wine px-4 py-2 text-sm font-bold text-white"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditing("")}
                    className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-2"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {c.title}
                    </h3>
                    <span className="rounded-full bg-cream px-3 py-0.5 text-xs font-bold text-wine">
                      {c.products.length} صورة
                    </span>
                  </div>
                  {c.blurb && (
                    <p className="mt-1 text-sm text-gray-brand">{c.blurb}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-2 transition hover:border-wine hover:text-wine"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="rounded-full bg-red-brand/10 px-4 py-2 text-sm font-bold text-red-brand transition hover:bg-red-brand hover:text-white"
                  >
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
