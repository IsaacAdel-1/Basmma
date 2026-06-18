import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getCategories } from "@/lib/store";
import { getStats } from "@/lib/analytics";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAuthed()) redirect("/admin/login");

  const [categories, stats] = await Promise.all([getCategories(), getStats()]);
  return <AdminShell categories={categories} stats={stats} />;
}
