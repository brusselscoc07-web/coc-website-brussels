import type { Metadata } from "next";
import Link from "next/link";
import PastEventsToggle from "@/components/PastEventsToggle";
import { events } from "@/lib/data";

export const metadata: Metadata = {
  title: "Upcoming Events — Church of Christ Brussels",
};

export default function EventsPage() {
  const upcoming = events.filter((e) => !e.past);
  const past = events.filter((e) => e.past);

  return (
    <div className="mx-auto max-w-[900px] px-8 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">What&apos;s Happening</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">Upcoming Events</div>
      </div>

      <div className="mb-10 flex flex-col gap-[18px]">
        {upcoming.map((ev) => (
          <Link
            key={ev.id}
            href={`/events/${ev.id}`}
            className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-white p-[22px] no-underline"
          >
            <div className="w-16 shrink-0 text-center">
              <div className="text-[22px] font-bold text-green">{ev.day}</div>
              <div className="text-[11px] tracking-[1px] text-text-muted uppercase">{ev.month}</div>
            </div>
            <div className="min-w-[200px] flex-1">
              <div className="mb-1 font-serif text-[20px] font-bold text-green-dark">{ev.title}</div>
              <div className="text-[13px] text-text-muted">
                {ev.date} · {ev.time}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <PastEventsToggle pastEvents={past} />
    </div>
  );
}
