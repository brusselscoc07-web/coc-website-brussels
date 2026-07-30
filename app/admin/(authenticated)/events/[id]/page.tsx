import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">Edit Event</div>
      <EventForm event={event} />
    </div>
  );
}
