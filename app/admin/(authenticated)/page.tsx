import { count, eq, gte, sql } from "drizzle-orm";
import Link from "next/link";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { albums, comments, contactSubmissions, events, pageViews, sermons } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const ICONS: Record<string, React.ReactNode> = {
  res: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11h8M8 15h8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  ev: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  gal: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 16l-5-5-4 4-3-3-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  comments: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11H9l-5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  live: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  about: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  hero: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path d="M4 17l5-5 3 3 4-4 4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  set: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
};

const QUICK_LINKS = [
  { href: "/admin/hero", label: "Homepage Hero", desc: "Welcome slides and highlight cards", icon: "hero" },
  { href: "/admin/sermons", label: "Resources", desc: "Sermons, thoughts, and teachings", icon: "res" },
  { href: "/admin/events", label: "Events", desc: "Upcoming events", icon: "ev" },
  { href: "/admin/albums", label: "Gallery", desc: "Photo albums", icon: "gal" },
  { href: "/admin/comments", label: "Comments", desc: "Moderate visitor comments", icon: "comments" },
  { href: "/admin/livestream", label: "Livestream", desc: "Go live or offline", icon: "live" },
  { href: "/admin/about", label: "About Page", desc: "Statement and worship details", icon: "about" },
  { href: "/admin/settings", label: "Site Settings", desc: "Location, footer, contact", icon: "set" },
] as const;

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default async function AdminHomePage() {
  const db = await getDb();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const sixMonthsAgo = new Date(startOfMonth);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const [
    [{ value: sermonCount }],
    [{ value: eventCount }],
    [{ value: albumCount }],
    [{ value: pendingComments }],
    [{ value: viewsTotal }],
    [{ value: viewsThisMonth }],
    [{ value: messagesTotal }],
    [{ value: messagesThisMonth }],
    viewsByMonth,
  ] = await Promise.all([
    db.select({ value: count() }).from(sermons),
    db.select({ value: count() }).from(events),
    db.select({ value: count() }).from(albums),
    db.select({ value: count() }).from(comments).where(eq(comments.status, "pending")),
    db.select({ value: count() }).from(pageViews),
    db.select({ value: count() }).from(pageViews).where(gte(pageViews.createdAt, startOfMonth)),
    db.select({ value: count() }).from(contactSubmissions),
    db.select({ value: count() }).from(contactSubmissions).where(gte(contactSubmissions.createdAt, startOfMonth)),
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${pageViews.createdAt}), 'YYYY-MM')`,
        value: count(),
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, sixMonthsAgo))
      .groupBy(sql`date_trunc('month', ${pageViews.createdAt})`)
      .orderBy(sql`date_trunc('month', ${pageViews.createdAt})`),
  ]);

  // Fill in the last 6 months even if some had zero views, so the chart never
  // looks broken/empty on a quiet month.
  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(startOfMonth);
    d.setMonth(d.getMonth() - (5 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = viewsByMonth.find((v) => v.month === key);
    return { label: MONTH_LABELS[d.getMonth()], value: found?.value ?? 0 };
  });
  const maxMonthly = Math.max(1, ...monthBuckets.map((m) => m.value));

  const contentStats = [
    { label: "Resources", value: sermonCount, href: "/admin/sermons" },
    { label: "Events", value: eventCount, href: "/admin/events" },
    { label: "Gallery Albums", value: albumCount, href: "/admin/albums" },
    { label: "Pending Comments", value: pendingComments, href: "/admin/comments" },
  ];

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Overview of your site content" />
      <div className="px-6 py-8 md:px-9">
        <div className="mb-3.5 text-[13px] font-semibold text-[#16233A]">Content</div>
        <div className="mb-8 grid grid-cols-2 gap-[14px] md:grid-cols-4">
          {contentStats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-[14px] border border-[#DCE7F0] bg-white px-5 py-4 no-underline transition-shadow hover:border-[#2E90D9] hover:shadow-[0_8px_20px_rgba(46,144,217,0.08)]"
            >
              <div className="text-[12.5px] text-[#7C93AA]">{s.label}</div>
              <div className="text-[26px] font-bold text-[#16233A]">{s.value}</div>
            </Link>
          ))}
        </div>

        <div className="mb-3.5 text-[13px] font-semibold text-[#16233A]">Visitors &amp; Messages</div>
        <div className="mb-8 grid grid-cols-1 gap-[18px] lg:grid-cols-[1fr_1fr_1.4fr]">
          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-5">
            <div className="text-[12.5px] text-[#7C93AA]">Page Views</div>
            <div className="mt-1 text-[26px] font-bold text-[#16233A]">{viewsTotal}</div>
            <div className="mt-1 text-[12px] text-[#7C93AA]">all time · {viewsThisMonth} this month</div>
          </div>
          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-5">
            <div className="text-[12.5px] text-[#7C93AA]">Contact Messages</div>
            <div className="mt-1 text-[26px] font-bold text-[#16233A]">{messagesTotal}</div>
            <div className="mt-1 text-[12px] text-[#7C93AA]">all time · {messagesThisMonth} this month</div>
          </div>
          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-5">
            <div className="mb-3 text-[12.5px] text-[#7C93AA]">Page Views — last 6 months</div>
            <div className="flex h-[64px] items-end gap-2.5">
              {monthBuckets.map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-[4px] bg-[#2E90D9]"
                    style={{ height: `${Math.max(4, (m.value / maxMonthly) * 48)}px` }}
                    title={`${m.value} views`}
                  />
                  <div className="text-[10px] text-[#7C93AA]">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3.5 text-[13px] font-semibold text-[#16233A]">Manage content</div>
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 md:grid-cols-3">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col gap-2.5 rounded-[14px] border border-[#DCE7F0] bg-white p-[18px] no-underline transition-shadow hover:border-[#2E90D9] hover:shadow-[0_8px_20px_rgba(46,144,217,0.08)]"
            >
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[#E4F1FB] text-[#2E90D9]">
                {ICONS[q.icon]}
              </span>
              <div className="text-[14px] font-semibold text-[#16233A]">{q.label}</div>
              <div className="text-[12.5px] text-[#7C93AA]">{q.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
