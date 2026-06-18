import type { Metadata } from "next";
import { Tajawal, Amiri, Cairo } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بصماية — Marina Moner | تابلوهات آيات وصلوات وكلمات ملهمة",
  description:
    "بصماية — تحويل الكلمات الملهمة إلى تابلوهات تترك أثر طيب في المكان والقلب. تابلوهات صلوات، آيات مسيحية، للبنات، لبيت جديد، ومنوعة.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable} ${amiri.variable}`}>
      <body className="font-sans leading-[1.7]">{children}</body>
    </html>
  );
}
