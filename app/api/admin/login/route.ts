import { NextRequest, NextResponse } from "next/server";
import { checkPassword, setSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(password || "")) {
    return NextResponse.json({ ok: false, error: "كلمة السر غير صحيحة" }, { status: 401 });
  }
  setSession();
  return NextResponse.json({ ok: true });
}
