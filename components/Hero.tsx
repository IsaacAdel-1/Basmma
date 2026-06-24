"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site, waLink } from "@/data/site";

export default function Hero({
  totalProducts,
  categoriesCount,
}: {
  totalProducts: number;
  categoriesCount: number;
}) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-cream text-center"
      style={{ padding: "150px clamp(20px,5vw,48px) 90px" }}
    >
      {/* ===== Background: clean top, photo only in the lower part ===== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* soft color glows */}
        <span className="absolute -left-24 -top-28 h-[460px] w-[460px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(192,21,43,.12),transparent_70%)] blur-[60px]" />
        <span className="absolute -bottom-32 -right-28 h-[440px] w-[440px] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(138,21,56,.12),transparent_70%)] blur-[60px]" />
        {/* the photo sits in the bottom band and fades up into the clean background */}
        <div className="absolute inset-x-0 bottom-0 h-[50%]">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#f5f3f4_0%,rgba(245,243,244,.80)_30%,rgba(245,243,244,.32)_100%)]" />
        </div>
      </div>

      <motion.div
        className="relative z-[2] mx-auto w-full max-w-[820px]"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center justify-center gap-2.5 text-[.85rem] font-bold uppercase text-red-brand">
          <i className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-brand" />
          {/* text-indent offsets the trailing letter-spacing so the words sit dead-center */}
          <span className="inline-block tracking-[5px] [text-indent:5px]">
            Handmade with love
          </span>
          <i className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-brand" />
        </span>

        <div className="mx-auto mt-3 w-[min(360px,72vw)] -translate-x-[4%]">
          <Image
            src="/logo-hero.png"
            alt={site.brand}
            width={1833}
            height={912}
            priority
            className="h-auto w-full"
          />
        </div>

        <h1
          className="mx-auto mt-7 max-w-[760px] font-display font-bold leading-[1.45] text-ink"
          style={{ fontSize: "clamp(1.6rem,4vw,2.7rem)" }}
        >
          جدرانك هي <span className="text-wine">معرض حياتك</span>
        </h1>

        <p className="mx-auto mt-5 max-w-[640px] text-[1.35rem] font-bold leading-[1.9] text-ink">
          لا تدع مساحاتك صامتة. اجعل كل زاوية، وكل مرحلة وكل ذكرى تروي فصلاً من
          قصتك الكاملة.
        </p>
        <p className="mx-auto mt-3 max-w-[600px] text-[.98rem] leading-[1.9] text-gray-brand">
          بصماية ليست مجرد تابلوهات، بل رسائل تستحق أن تبقى حاضرة في يومك.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a href="#collections" className="btn btn-primary">
            اكتشف التابلوهات <span aria-hidden>←</span>
          </a>
          <a
            href={waLink("مرحبًا، حابب أطلب تصميم 😊")}
            target="_blank"
            rel="noopener"
            className="btn btn-outline"
          >
            اطلب تصميمك
          </a>
        </div>

        {/* stats */}
        <div className="mx-auto mt-14 flex max-w-[560px] flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {[
            { n: `${totalProducts}+`, l: "تصميم جاهز" },
            { n: `${categoriesCount}`, l: "أقسام متنوعة" },
            { n: `${site.sizes.length}`, l: "مقاسات للطباعة" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <b className="block font-display text-[2.2rem] font-extrabold leading-none text-wine">
                {s.n}
              </b>
              <span className="text-[1.25rem] font-bold text-black">{s.l}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
