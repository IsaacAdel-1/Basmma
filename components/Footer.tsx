import Image from "next/image";
import { site, waLink, type Category } from "@/data/site";
import Reveal from "./Reveal";

export default function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer id="contact" className="bg-cream pt-[clamp(56px,7vw,90px)]">
      <div className="container-max">
        {/* CTA card */}
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[28px] text-center text-white shadow-soft"
            style={{
              background:
                "radial-gradient(130% 150% at 50% -20%, #a32647, #8a1538 50%, #5e0e26 120%)",
              padding: "clamp(48px,6vw,76px) clamp(24px,5vw,64px)",
            }}
          >
            <span className="pointer-events-none absolute inset-[14px] rounded-[18px] border border-white/15" />
            <div className="relative z-[2] mx-auto max-w-[600px]">
              <h2 className="mb-3 font-display text-[clamp(1.7rem,3.5vw,2.5rem)] font-bold">
                جاهزين نحوّل فكرتك <span className="text-[#ffb3bf]">لبصمة</span>
              </h2>
              <p className="mx-auto max-w-[460px] text-[#f3d9de]">
                ابعتلنا التصميم اللي عجبك والمقاس، ونردّ عليك بأقرب وقت بكل
                التفاصيل والأسعار.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <a
                  href={waLink("مرحبًا، حابب أطلب تابلوه 😊")}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-white px-9 py-3.5 font-bold text-wine transition-all hover:-translate-y-0.5 hover:bg-blush"
                >
                  واتساب <span aria-hidden>←</span>
                </a>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border-[1.5px] border-white/45 px-9 py-3.5 font-bold text-white transition-all hover:bg-white hover:text-wine"
                >
                  صفحة الفيسبوك
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* links grid */}
        <div className="grid gap-10 py-[clamp(40px,6vw,70px)] md:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <Image
              src="/logo.png"
              alt="بصماية"
              width={200}
              height={120}
              className="mb-4 h-[78px] w-auto"
            />
            <p className="mb-5 max-w-[340px] text-[.95rem] leading-[1.9] text-gray-brand">
              {site.mission}
            </p>
            <div className="flex gap-3">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white font-bold text-ink-2 transition-all hover:border-wine hover:bg-wine hover:text-white"
              >
                f
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-[.78rem] font-bold text-ink-2 transition-all hover:border-wine hover:bg-wine hover:text-white"
              >
                wa
              </a>
            </div>
          </div>

          <div>
            <h4 className="relative mb-4 pb-2.5 font-bold text-ink after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-8 after:bg-red-brand">
              روابط
            </h4>
            <ul className="grid gap-2.5">
              <li>
                <a
                  href="#collections"
                  className="text-[.95rem] text-gray-brand transition-all hover:pr-1 hover:text-wine"
                >
                  الأقسام
                </a>
              </li>
              <li>
                <a
                  href="#sizes"
                  className="text-[.95rem] text-gray-brand transition-all hover:pr-1 hover:text-wine"
                >
                  المقاسات والطلب
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="text-[.95rem] text-gray-brand transition-all hover:pr-1 hover:text-wine"
                >
                  آراء العملاء
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="relative mb-4 pb-2.5 font-bold text-ink after:absolute after:bottom-0 after:right-0 after:h-0.5 after:w-8 after:bg-red-brand">
              تواصل معنا
            </h4>
            <ul className="grid gap-3.5">
              <li className="flex flex-col">
                <span className="text-[.78rem] font-bold text-red-brand">واتساب</span>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener"
                  dir="ltr"
                  className="self-start font-medium text-ink"
                >
                  +20 {site.whatsappDisplay}
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[.78rem] font-bold text-red-brand">فيسبوك</span>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-ink"
                >
                  Marina Moner for Tablo
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[.78rem] font-bold text-red-brand">الطلب</span>
                <span className="font-medium text-ink">أونلاين — لكل المحافظات</span>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <p className="text-[.9rem] text-gray-brand">
            © {new Date().getFullYear()} بصماية — {site.owner}. كل الحقوق محفوظة.
          </p>
          <a
            href="#hero"
            className="rounded-full border border-line px-5 py-2.5 font-bold text-ink-2 transition-all hover:border-wine hover:text-wine"
          >
            لأعلى ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
