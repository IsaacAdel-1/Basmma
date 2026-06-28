import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "basma_admin";

// Required — set ADMIN_PASSWORD & ADMIN_SECRET in the host env (Vercel) and
// in .env.local for local dev. No fallbacks: a misconfigured deploy must fail
// loudly instead of silently running with public default credentials.
const PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.ADMIN_SECRET;

if (!PASSWORD) throw new Error("ADMIN_PASSWORD is required");
if (!SECRET) throw new Error("ADMIN_SECRET is required");

function token() {
  return crypto.createHash("sha256").update(PASSWORD + "|" + SECRET).digest("hex");
}

export function checkPassword(input: string) {
  return input === PASSWORD;
}

export function setSession() {
  cookies().set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export function isAuthed() {
  return cookies().get(COOKIE)?.value === token();
}
