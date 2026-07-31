import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { events as eventsTable } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
  if (!event) notFound();

  return (
    <div>
      <Topbar title="Edit Event" />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
          <EventForm event={event} />
        </div>
      </div>
    </div>
  );
}
