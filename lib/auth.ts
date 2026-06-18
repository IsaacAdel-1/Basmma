import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "basma_admin";

// Configure these via .env.local in production.
const PASSWORD = process.env.ADMIN_PASSWORD || "basma2026";
const SECRET = process.env.ADMIN_SECRET || "change-this-secret-key";

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
