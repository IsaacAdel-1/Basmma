"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { waLink, type Product, type Category } from "@/data/site";
import Reveal from "./Reveal";
import HeartReact from "./HeartReact";

type Flat = Product & { cat: string; catTitle: string };

const STEP = 8; // how many cards to reveal per "عرض المزيد" click

export default function Showcase({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string>("all");
  const [limit, setLimit] = useState<number>(STEP);
  const [lightbox, setLightbox] = useState<Flat | null>(null);

  const allProducts: Flat[] = useMemo(
    () =>
      categories.flatMap((c) =>
        c.products.map((p) => ({ ...p, cat: c.slug, catTitle: c.title }))
      ),
    [categories]
  );

  const filtered =
    active === "all" ? allProducts : allProducts.filter((p) => p.cat === active);
  const shown = filtered.slice(0, limit);

  // column count derived from the actual container width (not fixed
  // breakpoints) so 3 columns show whenever there's room for them.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setCols(Math.min(3, Math.max(1, Math.floor(w / 250))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // masonry distribution: drop each card into the currently shortest column
  // (column height estimated from each image's aspect ratio + caption). This
  // keeps the columns balanced so nothing dangles alone at the bottom, while
  // ties prefer the rightmost column to keep the right-to-left reading flow.
  const columns = useMemo(() => {
    const buckets: Flat[][] = Array.from({ length: cols }, () => []);
    const heights = new Array(cols).fill(0);
    for (const p of shown) {
      const ratio = p.width && p.height ? p.height / p.width : 1.25;
      let target = 0;
      for (let i = 1; i < cols; i++)
        if (heights[i] < heights[target]) target = i;
      buckets[target].push(p);
      heights[target] += ratio + 0.5; // +0.5 ≈ caption height
    }
    return buckets;
  }, [shown, cols]);

  const chips = [{ slug: "all", title: "الكل" }, ...categories];
  const activeTitle =
    chips.find((c) => c.slug === active)?.title ?? "كل المجموعات";

  const selectChip = (slug: string) => {
    setActive(slug);
    setLimit(STEP);
  };

  const shortCat = (t: string) => t.replace("تابلوهات ", "");

  return (
    <>
      <section id="collections" className="bg-cream py-[clamp(64px,8vw,110px)]">
        <div className="container-max">
          <Reveal className="mb-3">
            <span className="section-eyebrow">Our Collections</span>
          </Reveal>
          <Reveal className="text-center" delay={0.05}>
            <h2 className="section-title">
              تصفّح حسب <span className="text-wine">القسم</span>
            </h2>
            <p className="section-sub mt-3">
              مجموعة منتقاة بعناية من التابلوهات والكلمات الملهمة، مرتّبة علشان
              تلاقي اللي يناسبك بسهولة.
            </p>
          </Reveal>

          {/* filter chips */}
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {chips.map((c) => {
              const isActive = active === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => selectChip(c.slug)}
                  className={`rounded-full border px-5 py-2.5 text-[.9rem] font-bold transition-all ${
                    isActive
                      ? "border-wine bg-wine text-white shadow-[0_10px_24px_-14px_rgba(138,21,56,.7)]"
                      : "border-line bg-white text-ink-2 hover:border-wine hover:text-wine"
                  }`}
                >
                  {c.title}
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[.95rem] text-gray-brand">
            {activeTitle} —{" "}
            <span className="font-bold text-wine">{filtered.length}</span> تصميم
          </p>

          {/* cards — masonry: each column stacks tight to its images, so the
              image box matches the image's real size (no padding, no gaps) */}
          <div ref={wrapRef} className="mt-8 flex items-start gap-5 sm:gap-6">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-1 flex-col gap-5 sm:gap-6">
                {col.map((p) => (
                  <motion.figure
                    key={p.image}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setLightbox(p)}
                    className="group cursor-pointer overflow-hidden rounded-xl2 border border-line bg-cream-2 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    <div className="overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={p.width ?? 800}
                        height={p.height ?? 1000}
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 420px"
                        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <figcaption className="px-4 py-4 text-right">
                      <h4 className="font-display text-[1.05rem] font-bold text-ink">
                        {p.title}
                      </h4>
                      <span className="mt-0.5 block text-[.8rem] text-gray-brand">
                        {shortCat(p.catTitle)}
                      </span>
                      <HeartReact
                        productKey={p.image}
                        likes={p.likes ?? 0}
                        initialLiked={p.liked ?? false}
                      />
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            ))}
          </div>

          {/* show more */}
          {limit < filtered.length && (
            <div className="mt-11 text-center">
              <button
                onClick={() => setLimit((n) => n + STEP)}
                className="btn btn-outline"
              >
                عرض المزيد <span aria-hidden>↓</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== Lightbox ===== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink/80 p-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[88vh] max-w-[92vw] flex-col items-center"
            >
              <div className="relative max-h-[72vh] overflow-hidden rounded-xl2 bg-white p-3 shadow-soft">
                <img
                  src={lightbox.image}
                  alt={lightbox.title}
                  className="max-h-[66vh] w-auto rounded-lg object-contain"
                />
              </div>
              <div className="mt-5 flex flex-col items-center gap-3 text-center">
                <h4 className="font-display text-2xl font-bold text-white">
                  {lightbox.title}
                </h4>
                <a
                  href={waLink(`حابب أطلب تابلوه: ${lightbox.title}`)}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary"
                >
                  اطلب التصميم ده <span aria-hidden>←</span>
                </a>
              </div>
              <button
                aria-label="إغلاق"
                onClick={() => setLightbox(null)}
                className="absolute -top-3 left-0 grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-bold text-ink shadow-soft"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
