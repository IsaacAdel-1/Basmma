import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { addProduct } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAuthed())
    return NextResponse.json({ ok: false, error: "غير مصرّح" }, { status: 401 });

  try {
    const form = await req.formData();
    const slug = String(form.get("slug") || "");
    const title = String(form.get("title") || "");
    const width = Number(form.get("width")) || undefined;
    const height = Number(form.get("height")) || undefined;
    const file = form.get("file");

    if (!(file instanceof File))
      return NextResponse.json({ ok: false, error: "لم يتم اختيار صورة" }, { status: 400 });

    // image is already compressed in the browser; just sanity-check size
    if (file.size > 8 * 1024 * 1024)
      return NextResponse.json({ ok: false, error: "الصورة كبيرة جداً" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const contentType = file.type || "image/jpeg";
    const { image } = await addProduct(slug, title, bytes, contentType, width, height);
    return NextResponse.json({ ok: true, image });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "حصل خطأ أثناء الرفع" },
      { status: 500 }
    );
  }
}
