import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import Sizes from "@/components/Sizes";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Tracker from "@/components/Tracker";
import { getCategories } from "@/lib/store";

export const dynamic = "force-dynamic"; // always read latest products.json

export default async function Home() {
  const categories = await getCategories();
  const totalProducts = categories.reduce((n, c) => n + c.products.length, 0);

  return (
    <main>
      <Tracker />
      <Navbar />
      <Hero totalProducts={totalProducts} categoriesCount={categories.length} />
      <Showcase categories={categories} />
      <Sizes />
      <Testimonials />
      <Footer categories={categories} />
    </main>
  );
}
