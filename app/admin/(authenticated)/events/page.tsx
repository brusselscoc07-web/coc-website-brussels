import { desc } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const db = await getDb();
  const allEvents = await db.select().from(eventsTable).orderBy(desc(eventsTable.eventDate));

  return (
    <div>
      <Topbar title="Events" subtitle="Upcoming events shown on the homepage and Events page" />
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
          <Link
            href="/admin/events/new"
            className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline"
          >
            + New Event
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {allEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#DCE7F0] bg-white p-4"
            >
              <div>
                <div className="text-[15px] font-semibold text-[#16233A]">{ev.title}</div>
                <div className="text-[13px] text-[#7C93AA]">
                  {ev.dateLabel || formatDate(ev.eventDate)} · {ev.eventTime}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/events/${ev.id}`} className="text-[13px] font-semibold text-[#2E90D9] no-underline">
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
          {allEvents.length === 0 && <div className="text-[14px] text-[#7C93AA]">No events yet.</div>}
        </div>
      </div>
    </div>
  );
}
