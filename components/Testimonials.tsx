import Reveal from "./Reveal";

const reviews = [
  {
    text: "التابلوه طلع أحلى من الصورة، الطباعة والألوان نضيفة جدًا وغلّفولي بعناية. وصل بسرعة وكان هدية تخرّج مميزة.",
    name: "ميرنا. أ",
    tag: "هدية تخرّج",
  },
  {
    text: "اخترت آية لغرفة بنتي، الشكل حلو جدًا ونادى على الحيطة وملا المكان دفا. أنصح بيها بكل تأكيد.",
    name: "نورا. م",
    tag: "تابلوه آية",
  },
  {
    text: "تعامل راقي وتفاصيل دقيقة، حسّيت إن في حب حقيقي في الشغل. التابلوه بقى أول حاجة بتلفت نظر أي حد يدخل البيت.",
    name: "ماريوس. ج",
    tag: "تابلوه صلاة",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-[clamp(64px,8vw,110px)]">
      <div className="container-max">
        <Reveal className="mb-3">
          <span className="section-eyebrow">Kind Words</span>
        </Reveal>
        <Reveal className="text-center" delay={0.05}>
          <h2 className="section-title">
            آراء <span className="text-wine">عملائنا</span>
          </h2>
          <p className="section-sub mt-3">
            ناس كتير خلّت كلمة ملهمة جزء من بيتها… دي بعض كلماتهم عننا.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-xl2 border border-line bg-cream-2 p-8">
                <span
                  aria-hidden
                  className="mb-3 font-display text-[2.6rem] leading-none text-red-brand"
                >
                  &rdquo;
                </span>
                <blockquote className="flex-1 text-[1rem] leading-[1.95] text-ink-2">
                  {r.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-bold text-ink">{r.name}</span>
                  <span className="text-[.82rem] text-gray-brand">{r.tag}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
