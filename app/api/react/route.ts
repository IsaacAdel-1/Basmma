import { NextRequest, NextResponse } from "next/server";
import { toggleReaction } from "@/lib/store";
import { visitorId, ipFromHeaders } from "@/lib/visitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const image = typeof body.image === "string" ? body.image : "";

    // identify the device by a hash of its ip + user-agent (one heart each)
    const visitor = visitorId(
      ipFromHeaders((k) => req.headers.get(k)),
      req.headers.get("user-agent") || ""
    );

    const result = await toggleReaction(image, visitor);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "تعذّر تسجيل الإعجاب" },
      { status: 400 }
    );
  }
}
