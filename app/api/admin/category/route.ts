import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { addCategory, updateCategory, deleteCategory } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const guard = () =>
  NextResponse.json({ ok: false, error: "غير مصرّح" }, { status: 401 });

const fail = (e: any) =>
  NextResponse.json(
    { ok: false, error: e?.message || "حصل خطأ" },
    { status: 400 }
  );

// create a new tab
export async function POST(req: NextRequest) {
  if (!isAuthed()) return guard();
  try {
    const { title, blurb } = await req.json();
    const { slug } = await addCategory(String(title || ""), String(blurb || ""));
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return fail(e);
  }
}

// rename / edit a tab
export async function PATCH(req: NextRequest) {
  if (!isAuthed()) return guard();
  try {
    const { slug, title, blurb } = await req.json();
    await updateCategory(String(slug || ""), String(title || ""), String(blurb || ""));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

// delete a tab and everything in it
export async function DELETE(req: NextRequest) {
  if (!isAuthed()) return guard();
  try {
    const { slug } = await req.json();
    await deleteCategory(String(slug || ""));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
