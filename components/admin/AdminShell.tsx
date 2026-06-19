"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/data/site";
import Analytics from "./Analytics";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";

type TabKey = "analytics" | "products" | "categories";

export default function AdminShell({
  categories,
  stats,
}: {
  categories: Category[];
  stats: React.ComponentProps<typeof Analytics>["stats"];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("analytics");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-white/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="بصماية" width={120} height={70} className="h-[54px] w-auto" />
          <span className="font-display text-lg font-bold text-ink">لوحة التحكم</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-2 transition hover:border-wine hover:text-wine">
            عرض الموقع ↗
          </a>
          <button onClick={() => router.refresh()} className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink-2 transition hover:border-wine hover:text-wine">
            تحديث
          </button>
          <button onClick={logout} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-wine">
            خروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-5 py-8">
        {/* tabs */}
        <div className="mb-8 inline-flex rounded-full border border-line bg-white p-1">
          {[
            { k: "analytics", l: "📊 التحليلات والزوّار" },
            { k: "products", l: "🖼️ إدارة الصور" },
            { k: "categories", l: "🗂️ الأقسام (التابات)" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as TabKey)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                tab === t.k ? "bg-gradient-to-br from-wine to-red-brand text-white" : "text-ink-2 hover:text-wine"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>

        {tab === "analytics" && <Analytics stats={stats} />}
        {tab === "products" && <ProductsManager categories={categories} />}
        {tab === "categories" && <CategoriesManager categories={categories} />}
      </div>
    </div>
  );
}
