"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "خطأ في تسجيل الدخول");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-[400px] rounded-xl2 border border-line bg-white p-8 shadow-soft"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="بصماية" width={160} height={100} className="h-[90px] w-auto" />
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">لوحة التحكم</h1>
          <p className="text-[.9rem] text-gray-brand">سجّل دخولك لإدارة الموقع</p>
        </div>

        <label className="mb-2 block text-sm font-bold text-ink-2">كلمة السر</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mb-4 w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-wine"
          placeholder="••••••••"
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-brand/10 px-3 py-2 text-sm font-bold text-red-brand">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
