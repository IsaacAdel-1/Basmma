export type Product = {
  title: string;
  image: string;
};

export type Category = {
  slug: string;
  title: string;
  blurb: string;
  products: Product[];
};

export const site = {
  brand: "بصماية",
  owner: "Marina Moner",
  tagline: "✨ كل قطعة هنا وراها رسالة… بتقدّم فكرة بتعمل فرق",
  hashtag: "#بتقدم_فكرة_بتعمل_فرق",
  mission:
    "رسالة بصماية: تحويل الكلمات الملهمة إلى تابلوهات تترك أثر طيب في المكان والقلب… بعض الكلمات تستحق أن تبقى أمام أعيننا دائمًا.",
  whatsapp: "201012756820",
  whatsappDisplay: "0101 275 6820",
  facebook: "https://www.facebook.com/marinamonerfortablo",
  sizes: ["10×15", "15×20", "20×30", "30×40", "40×50", "50×60", "50×70"],
};

// thumbnails / labels used by the admin category selector
export const categoryMeta: { slug: string; title: string; blurb: string }[] = [
  { slug: "prayers", title: "تابلوهات صلوات", blurb: "صلوات تملأ المكان سكينة وتفكّرك إن ربنا قريب في كل وقت." },
  { slug: "verses", title: "تابلوهات آيات مسيحية", blurb: "آيات بتلمس القلب، بتصميم وألوان راقية تليق بكلمة الكتاب." },
  { slug: "girls", title: "تابلوهات للبنات", blurb: "كلمات بتفكّر كل بنت إنها جميلة وقيّمة ومحبوبة." },
  { slug: "home", title: "تابلوهات لبيت جديد", blurb: "هدية مثالية لبيت جديد، بتملأه بركة ودفا من أول يوم." },
  { slug: "misc", title: "تابلوهات منوعة", blurb: "كلمات ملهمة لكل المساحات والأذواق، تنشر طاقة إيجابية حواليك." },
];

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${
    text ? `?text=${encodeURIComponent(text)}` : ""
  }`;
