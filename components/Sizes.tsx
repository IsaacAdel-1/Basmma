import { site, waLink } from "@/data/site";
import Reveal from "./Reveal";

const steps = [
  { n: "١", t: "اختار التصميم", d: "اتفرّج على الأقسام واختار الكلمة أو الآية اللي بتكلّمك." },
  { n: "٢", t: "حدّد المقاس", d: "اختار المقاس اللي يناسب مكانك من المقاسات المتاحة." },
  { n: "٣", t: "اطلب واستلم", d: "ابعتلنا على واتساب، ونجهّزلك التابلوه بأعلى جودة طباعة." },
];

export default function Sizes() {
  return (
    <section id="sizes" className="bg-cream py-[clamp(64px,8vw,110px)]">
      <div className="container-max">
        <Reveal className="mb-3">
          <span className="section-eyebrow">Sizes &amp; Order</span>
        </Reveal>
        <Reveal className="text-center" delay={0.05}>
          <h2 className="section-title">
            مقاسات تناسب <span className="text-wine">كل مكان</span>
          </h2>
          <p className="section-sub mt-3">
            اختار المقاس اللي يليق بحيطتك، من القطع الصغيرة لحد التابلوهات الكبيرة.
          </p>
        </Reveal>

        {/* sizes grid */}
        <div className="mx-auto mt-12 grid max-w-[820px] grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {site.sizes.map((s, i) => (
            <Reveal key={s} delay={i * 0.05}>
              <div className="group flex aspect-square flex-col items-center justify-center rounded-xl2 border border-line bg-white transition-all hover:-translate-y-1 hover:border-wine hover:shadow-card-hover">
                <span className="font-display text-[1.2rem] font-bold text-wine">
                  {s}
                </span>
                <span className="text-[.7rem] text-gray-brand">سم</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* steps */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full rounded-xl2 border border-line bg-white p-8 transition-all hover:-translate-y-1.5 hover:shadow-card-hover">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blush font-display text-[1.5rem] font-bold text-red-brand">
                  {s.n}
                </span>
                <h3 className="mb-2 mt-4 font-display text-[1.25rem] font-bold text-ink">
                  {s.t}
                </h3>
                <p className="text-[.98rem] leading-[1.8] text-gray-brand">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a
            href={waLink("مرحبًا، حابب أعرف الأسعار والمقاسات 😊")}
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            اسأل عن الأسعار <span aria-hidden>←</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
