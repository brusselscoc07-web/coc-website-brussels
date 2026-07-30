import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import SermonForm from "@/components/admin/SermonForm";
import { getDb } from "@/lib/db";
import { sermons as sermonsTable } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [sermon] = await db.select().from(sermonsTable).where(eq(sermonsTable.id, id));
  if (!sermon) notFound();

  return (
    <div className="mx-auto max-w-3xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">Edit Resource</div>
      <SermonForm sermon={sermon} />
    </div>
  );
}
