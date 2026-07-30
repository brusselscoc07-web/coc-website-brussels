import { desc } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const db = await getDb();
  const allEvents = await db.select().from(eventsTable).orderBy(desc(eventsTable.eventDate));

  return (
    <div className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="font-serif text-[32px] font-bold text-green-dark">Events</div>
        <Link
          href="/admin/events/new"
          className="cursor-pointer rounded-full bg-green px-6 py-3 text-[14px] font-semibold text-bg no-underline"
        >
          + New Event
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {allEvents.map((ev) => (
          <div
            key={ev.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5"
          >
            <div>
              <div className="font-serif text-[18px] font-bold text-green-dark">{ev.title}</div>
              <div className="text-[13px] text-text-muted">
                {ev.dateLabel || formatDate(ev.eventDate)} · {ev.eventTime}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/events/${ev.id}`} className="text-[13px] font-semibold text-green no-underline">
                Edit
              </Link>
              <form action={deleteEvent.bind(null, ev.id)}>
                <ConfirmSubmitButton confirmText={`Delete "${ev.title}"? This can't be undone.`}>
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {allEvents.length === 0 && <div className="text-[14px] text-text-muted">No events yet.</div>}
      </div>
    </div>
  );
}
