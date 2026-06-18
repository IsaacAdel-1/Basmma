import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { deleteProduct } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  if (!isAuthed())
    return NextResponse.json({ ok: false, error: "غير مصرّح" }, { status: 401 });

  try {
    const { slug, image } = await req.json();
    if (!slug || !image)
      return NextResponse.json({ ok: false, error: "بيانات ناقصة" }, { status: 400 });
    await deleteProduct(slug, image);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "حصل خطأ أثناء الحذف" },
      { status: 500 }
    );
  }
}
