import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip =
      fwd.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";

    await recordVisit({
      ip,
      ua: req.headers.get("user-agent") || "",
      path: typeof body.path === "string" ? body.path : "/",
      referrer: typeof body.referrer === "string" ? body.referrer : "",
    });
  } catch {
    /* never break the page over analytics */
  }
  return NextResponse.json({ ok: true });
}
