import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import PastEventsToggle from "@/components/PastEventsToggle";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";
import { formatDate, formatEventBadge } from "@/lib/format";

export const metadata: Metadata = {
  title: "Upcoming Events — Church of Christ Brussels",
};

// Queries the DB, so it must render per request rather than at build time —
// see app/page.tsx for why (PGlite's file-locked engine crashes under Next's
// parallel static-generation workers; force-dynamic also keeps upcoming/past
// current since that split is computed from eventDate, not stored).
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const db = await getDb();
  const allEvents = await db.select().from(eventsTable).orderBy(asc(eventsTable.eventDate));

  const todayUTC = new Date().toISOString().slice(0, 10);
  const upcoming = allEvents.filter((e) => e.eventDate >= todayUTC);
  const past = allEvents.filter((e) => e.eventDate < todayUTC).reverse();

  return (
    <div className="mx-auto max-w-[900px] px-8 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">What&apos;s Happening</div>
        <div className="font-serif text-[28px] font-bold text-green-dark min-[880px]:text-[42px]">Upcoming Events</div>
      </div>

      <div className="mb-10 flex flex-col gap-[18px]">
        {upcoming.map((ev) => {
          const badge = formatEventBadge(ev.eventDate);
          return (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-white p-4 no-underline min-[880px]:p-[22px]"
            >
              <div className="w-16 shrink-0 text-center">
                <div className="text-[22px] font-bold text-green">{badge.day}</div>
                <div className="text-[11px] tracking-[1px] text-text-muted uppercase">{badge.month}</div>
              </div>
              <div className="min-w-[200px] flex-1">
                <div className="mb-1 font-serif text-[20px] font-bold text-green-dark">{ev.title}</div>
                <div className="text-[13px] text-text-muted">
                  {ev.dateLabel || formatDate(ev.eventDate)} · {ev.eventTime}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <PastEventsToggle
        pastEvents={past.map((ev) => ({ id: ev.id, title: ev.title, date: ev.dateLabel || formatDate(ev.eventDate) }))}
      />
    </div>
  );
}
