import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import SermonForm from "@/components/admin/SermonForm";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { sermons as sermonsTable } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function EditSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [sermon] = await db.select().from(sermonsTable).where(eq(sermonsTable.id, id));
  if (!sermon) notFound();

  return (
    <div>
      <Topbar title="Edit Resource" />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
          <SermonForm sermon={sermon} />
        </div>
      </div>
    </div>
  );
}
