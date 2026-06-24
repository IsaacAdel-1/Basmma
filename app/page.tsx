import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Sizes from "@/components/Sizes";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import { getCategories } from "@/lib/store";
import { visitorId, ipFromHeaders } from "@/lib/visitor";
import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // always read the latest data per visitor

export default async function Home() {
  const h = headers();
  const visitor = visitorId(ipFromHeaders((k) => h.get(k)), h.get("user-agent") || "");
  const categories = await getCategories(visitor);
  const totalProducts = categories.reduce((n, c) => n + c.products.length, 0);

  return (
    <main>
      <Tracker />
      <Navbar />
      <Hero totalProducts={totalProducts} categoriesCount={categories.length} />
      <Showcase categories={categories} />
      <Sizes />
      <Footer categories={categories} />
    </main>
  );
}
