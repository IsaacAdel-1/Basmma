type Row = { label: string; value: number };
type Stats = {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  last7Visits: number;
  byDevice: Row[];
  byOS: Row[];
  byBrowser: Row[];
  byCountry: Row[];
  perDay: Row[];
  recent: {
    time: number;
    device: string;
    os: string;
    browser: string;
    country: string;
    city: string;
    referrer: string;
  }[];
};

function Stat({ n, l, accent }: { n: number; l: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl2 border p-5 ${
        accent ? "border-transparent bg-gradient-to-br from-wine to-red-brand text-white" : "border-line bg-white"
      }`}
    >
      <b className={`block font-display text-[2.2rem] font-extrabold leading-none ${accent ? "text-white" : "text-wine"}`}>
        {n.toLocaleString("ar-EG")}
      </b>
      <span className={`text-sm ${accent ? "text-white/85" : "text-gray-brand"}`}>{l}</span>
    </div>
  );
}

function Bars({ title, rows }: { title: string; rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-xl2 border border-line bg-white p-5">
      <h3 className="mb-4 font-bold text-ink">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-gray-brand">لا توجد بيانات بعد.</p>}
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex justify-between text-[.85rem]">
              <span className="font-medium text-ink-2">{r.label}</span>
              <span className="font-bold text-wine">{r.value}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream-2">
              <div
                className="h-full rounded-full bg-gradient-to-l from-wine to-red-brand"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics({ stats }: { stats: Stats }) {
  const maxDay = Math.max(1, ...stats.perDay.map((d) => d.value));
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat n={stats.totalVisits} l="إجمالي الزيارات" accent />
        <Stat n={stats.uniqueVisitors} l="زوّار مختلفون" />
        <Stat n={stats.todayVisits} l="زيارات اليوم" />
        <Stat n={stats.last7Visits} l="آخر ٧ أيام" />
      </div>

      {/* per-day chart */}
      <div className="rounded-xl2 border border-line bg-white p-5">
        <h3 className="mb-5 font-bold text-ink">الزيارات خلال آخر ٧ أيام</h3>
        <div className="flex h-40 items-end justify-between gap-2">
          {stats.perDay.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-bold text-wine">{d.value}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-wine to-red-brand transition-all"
                style={{ height: `${(d.value / maxDay) * 100}%`, minHeight: d.value ? 6 : 2 }}
              />
              <span className="text-[.7rem] text-gray-brand">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Bars title="نوع الجهاز" rows={stats.byDevice} />
        <Bars title="نظام التشغيل" rows={stats.byOS} />
        <Bars title="المتصفح" rows={stats.byBrowser} />
        <Bars title="الدولة" rows={stats.byCountry} />
      </div>

      {/* recent visits */}
      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        <h3 className="border-b border-line p-5 font-bold text-ink">آخر الزيارات</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-cream text-gray-brand">
              <tr>
                <th className="p-3 font-bold">الوقت</th>
                <th className="p-3 font-bold">الجهاز</th>
                <th className="p-3 font-bold">النظام</th>
                <th className="p-3 font-bold">المتصفح</th>
                <th className="p-3 font-bold">المكان</th>
                <th className="p-3 font-bold">المصدر</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-brand">
                    لسه مفيش زيارات مسجّلة.
                  </td>
                </tr>
              )}
              {stats.recent.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="p-3 text-ink-2">
                    {new Date(r.time).toLocaleString("ar-EG", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">{r.device}</td>
                  <td className="p-3">{r.os}</td>
                  <td className="p-3">{r.browser}</td>
                  <td className="p-3">{r.city !== "—" ? `${r.city}، ${r.country}` : r.country}</td>
                  <td className="p-3 text-gray-brand">{r.referrer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
