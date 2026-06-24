import "server-only";
import crypto from "crypto";

/** Anonymous, stable id for a device = hash of its IP + user-agent. */
export function visitorId(ip: string, ua: string) {
  return crypto
    .createHash("sha256")
    .update((ip || "") + "|" + (ua || ""))
    .digest("hex")
    .slice(0, 16);
}

/** Pull the client IP out of the usual proxy headers. */
export function ipFromHeaders(get: (k: string) => string | null) {
  const fwd = get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || get("x-real-ip") || "";
}
