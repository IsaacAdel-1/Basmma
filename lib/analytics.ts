import "server-only";
import crypto from "crypto";
import { supabaseAdmin } from "./supabase";

const MAX_EVENTS = 5000; // how many recent visits to pull for the stats

export type Visit = {
  time: number; // epoch ms (derived from the `ts` column)
  visitor: string; // hashed ip+ua (anonymous unique id)
  device: "موبايل" | "تابلت" | "لابتوب / كمبيوتر";
  os: string;
  browser: string;
  path: string;
  referrer: string;
  country: string;
  city: string;
};

/** very small, dependency-free user-agent parser */
export function parseUA(ua: string) {
  const u = ua || "";
  let device: Visit["device"] = "لابتوب / كمبيوتر";
  if (/tablet|ipad|playbook|silk/i.test(u) || (/android/i.test(u) && !/mobile/i.test(u)))
    device = "تابلت";
  else if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(u))
    device = "موبايل";

  let os = "غير معروف";
  if (/windows nt 10/i.test(u)) os = "Windows 10/11";
  else if (/windows/i.test(u)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(u)) os = "iOS";
  else if (/mac os x/i.test(u)) os = "macOS";
  else if (/android/i.test(u)) os = "Android";
  else if (/linux/i.test(u)) os = "Linux";

  let browser = "غير معروف";
  if (/edg\//i.test(u)) browser = "Edge";
  else if (/opr\/|opera/i.test(u)) browser = "Opera";
  else if (/chrome\//i.test(u) && !/edg\//i.test(u)) browser = "Chrome";
  else if (/firefox\//i.test(u)) browser = "Firefox";
  else if (/safari\//i.test(u) && !/chrome/i.test(u)) browser = "Safari";

  return { device, os, browser };
}

async function readAll(): Promise<Visit[]> {
  const { data, error } = await supabaseAdmin
    .from("visits")
    .select("ts,visitor,device,os,browser,path,referrer,country,city")
    .order("ts", { ascending: false })
    .limit(MAX_EVENTS);
  if (error || !data) return [];
  // map to the internal shape (epoch ms) and return in chronological order
  return data
    .map((r) => ({
      time: new Date(r.ts as string).getTime(),
      visitor: r.visitor,
      device: r.device,
      os: r.os,
      browser: r.browser,
      path: r.path,
      referrer: r.referrer,
      country: r.country,
      city: r.city,
    }))
    .reverse() as Visit[];
}

async function geoLookup(ip: string): Promise<{ country: string; city: string }> {
  // skip private / local addresses
  if (
    !ip ||
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  ) {
    return { country: "محلي", city: "—" };
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city`,
      { signal: AbortSignal.timeout(2500) }
    );
    const j = await res.json();
    if (j.status === "success")
      return { country: j.country || "غير معروف", city: j.city || "—" };
  } catch {
    /* offline / rate-limited → ignore */
  }
  return { country: "غير معروف", city: "—" };
}

export async function recordVisit(input: {
  ip: string;
  ua: string;
  path: string;
  referrer: string;
}) {
  const { device, os, browser } = parseUA(input.ua);
  const geo = await geoLookup(input.ip);
  const visitor = crypto
    .createHash("sha256")
    .update(input.ip + "|" + input.ua)
    .digest("hex")
    .slice(0, 16);

  await supabaseAdmin.from("visits").insert({
    visitor,
    device,
    os,
    browser,
    path: input.path || "/",
    referrer: input.referrer || "مباشر",
    country: geo.country,
    city: geo.city,
  });
}

function countBy<T extends string>(rows: Visit[], key: keyof Visit) {
  const map = new Map<T, number>();
  for (const r of rows) {
    const k = r[key] as T;
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** turn a raw url path into a friendly Arabic page name */
function pageName(p: string) {
  const clean = (p || "/").split("?")[0].split("#")[0];
  if (clean === "/" || clean === "") return "الصفحة الرئيسية";
  if (clean.startsWith("/admin")) return "لوحة التحكم";
  return clean;
}

export async function getStats() {
  const all = await readAll();
  const now = Date.now();
  const dayMs = 86400000;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const uniqueVisitors = new Set(all.map((v) => v.visitor)).size;
  const today = all.filter((v) => v.time >= startOfDay.getTime());
  const last7 = all.filter((v) => v.time >= now - 7 * dayMs);
  // "online now" = distinct visitors seen in the last 5 minutes
  const onlineNow = new Set(
    all.filter((v) => v.time >= now - 5 * 60000).map((v) => v.visitor)
  ).size;

  // visits per day for the last 7 days
  const perDay: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    d.setHours(0, 0, 0, 0);
    const next = d.getTime() + dayMs;
    const count = all.filter((v) => v.time >= d.getTime() && v.time < next).length;
    perDay.push({
      label: d.toLocaleDateString("ar-EG", { weekday: "short", day: "numeric" }),
      value: count,
    });
  }

  // top pages (friendly names)
  const byPath = countBy(
    all.map((v) => ({ ...v, path: pageName(v.path) })) as Visit[],
    "path"
  ).slice(0, 8);

  // top cities (skip unknowns)
  const byCity = countBy(
    all.filter((v) => v.city && v.city !== "—") as Visit[],
    "city"
  ).slice(0, 8);

  // traffic sources — show the referrer's domain only
  const sources = all.map((v) => {
    let r = v.referrer || "مباشر";
    if (r === "مباشر" || r === "") r = "مباشر (بدون مصدر)";
    else
      try {
        r = new URL(r).hostname.replace(/^www\./, "");
      } catch {
        /* keep as-is */
      }
    return { ...v, referrer: r } as Visit;
  });
  const byReferrer = countBy(sources, "referrer").slice(0, 8);

  return {
    totalVisits: all.length,
    uniqueVisitors,
    todayVisits: today.length,
    last7Visits: last7.length,
    onlineNow,
    byDevice: countBy(all, "device"),
    byOS: countBy(all, "os"),
    byBrowser: countBy(all, "browser"),
    byCountry: countBy(all, "country").slice(0, 8),
    byCity,
    byPath,
    byReferrer,
    perDay,
    recent: [...all]
      .reverse()
      .slice(0, 40)
      .map((v) => ({
        time: v.time,
        device: v.device,
        os: v.os,
        browser: v.browser,
        country: v.country,
        city: v.city,
        path: pageName(v.path),
        referrer: v.referrer,
      })),
  };
}
