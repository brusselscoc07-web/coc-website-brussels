import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DualTimezoneTime from "@/components/DualTimezoneTime";
import { buildIcs, location } from "@/lib/data";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }): Promise<Metadata> {
  const { eventId } = await params;
  const db = await getDb();
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
  return { title: event ? `${event.title} — Church of Christ Brussels` : "Event — Church of Christ Brussels" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const db = await getDb();
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, eventId));
  if (!event) notFound();

  return (
    <div>
      <div className="relative flex h-[min(52vh,460px)] min-h-[320px] items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url(${event.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(27,46,37,0.15) 0%, rgba(20,24,20,0.85) 100%)" }}
        />
        <Link
          href="/events"
          className="absolute left-8 top-7 z-[3] cursor-pointer rounded-full bg-[rgba(20,24,20,0.45)] px-5 py-2.5 text-[15px] font-semibold text-bg no-underline"
        >
          ← All Events
        </Link>
        <div className="relative z-[2] mx-auto w-full max-w-[900px] px-8 pb-11">
          <div className="mb-2.5 text-[12px] tracking-[3px] text-gold-light uppercase">Upcoming Event</div>
          <div className="font-serif text-[clamp(30px,4.5vw,48px)] font-bold leading-[1.1] text-bg">{event.title}</div>
        </div>
      </div>
      <div className="mx-auto max-w-[900px] px-8 pb-20 pt-12">
        <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <div className="rounded-2xl border border-border bg-white p-[22px]">
            <div className="mb-2 text-[11px] tracking-[1.5px] text-gold uppercase">Date</div>
            <div className="text-[17px] font-semibold text-green-dark">
              {event.dateLabel || formatDate(event.eventDate)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-[22px]">
            <div className="mb-2 text-[11px] tracking-[1.5px] text-gold uppercase">Time</div>
            <div className="text-[17px] font-semibold text-green-dark">{event.eventTime}</div>
            {event.eventDateTime && (
              <div className="mt-1 text-[12.5px] text-text-muted">
                <DualTimezoneTime iso={event.eventDateTime.toISOString()} />
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-white p-[22px]">
            <div className="mb-2 text-[11px] tracking-[1.5px] text-gold uppercase">Location</div>
            <div className="text-[17px] font-semibold text-green-dark">{event.location || location.address}</div>
          </div>
        </div>
        <div className="mb-4 font-serif text-[24px] font-bold text-green-dark">About This Event</div>
        <div className="mb-10 text-[16px] leading-[1.9] text-ink-soft">{event.description}</div>
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-bg-alt p-8">
          <div>
            <div className="mb-1 font-serif text-[20px] font-bold text-green-dark">Don&apos;t miss it</div>
            <div className="text-[14px] text-text-muted">Add this event to your calendar so you don&apos;t forget.</div>
          </div>
          <a
            href={buildIcs({
              id: event.id,
              title: event.title,
              description: event.description || "",
              location: event.location || "",
            })}
            download={`${event.id}.ics`}
            className="inline-block cursor-pointer whitespace-nowrap rounded-full bg-green px-[30px] py-3.5 text-[14px] font-semibold text-bg no-underline"
          >
            + Add to Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
