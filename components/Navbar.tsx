"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { waLink } from "@/data/site";

const links = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#collections", label: "الأقسام" },
  { href: "#sizes", label: "المقاسات والطلب" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className="fixed top-0 right-0 z-[1000] h-[3px]"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg,#8a1538,#c0152b)",
        }}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300 ${
          scrolled
            ? "border-line bg-white/90 shadow-[0_8px_30px_-22px_rgba(26,20,22,.45)] backdrop-blur-md"
            : "border-transparent bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="container-max flex items-center justify-between gap-4 py-2.5">
          <a href="#hero" className="flex shrink-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt="بصماية - Marina Moner"
              width={300}
              height={300}
              priority
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-[64px]" : "h-[78px]"
              } max-[760px]:!h-[56px]`}
            />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[.95rem] font-medium text-ink-2 transition-colors hover:text-wine"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href={waLink("مرحبًا، حابب أستفسر عن التابلوهات 😊")}
            target="_blank"
            rel="noopener"
            className="hidden rounded-full border-[1.5px] border-wine px-6 py-2.5 text-[.9rem] font-bold text-wine transition-all hover:bg-wine hover:text-white md:inline-flex"
          >
            تواصل معنا
          </a>

          <button
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-2 md:hidden"
          >
            <span
              className={`h-[2.5px] w-[26px] rounded bg-ink transition-all ${
                open ? "translate-y-[7.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2.5px] w-[26px] rounded bg-ink transition-all ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2.5px] w-[26px] rounded bg-ink transition-all ${
                open ? "-translate-y-[7.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[90] md:hidden transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* backdrop — tap to close */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        />
        {/* drawer (slides in from the right) */}
        <div
          className={`absolute inset-y-0 right-0 flex w-[78%] max-w-[320px] flex-col items-center justify-center gap-6 bg-white shadow-soft transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[1.15rem] font-medium text-ink-2 transition-colors hover:text-wine"
            >
              {l.label}
            </a>
          ))}
          <a
            href={waLink()}
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
            className="rounded-full border-[1.5px] border-wine px-7 py-3 font-bold text-wine"
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </>
  );
}
