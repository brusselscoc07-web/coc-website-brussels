import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { getDb } from "@/lib/db";
import { albums as albumsTable, photos as photosTable } from "@/lib/db/schema";
import { formatMonthYear } from "@/lib/format";
import { deleteAlbum } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const db = await getDb();
  const allAlbums = await db.select().from(albumsTable).orderBy(desc(albumsTable.albumDate));

  const withCounts = await Promise.all(
    allAlbums.map(async (al) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(photosTable)
        .where(eq(photosTable.albumId, al.id));
      return { ...al, photoCount: count };
    }),
  );

  return (
    <div className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="font-serif text-[32px] font-bold text-green-dark">Albums</div>
        <Link
          href="/admin/albums/new"
          className="cursor-pointer rounded-full bg-green px-6 py-3 text-[14px] font-semibold text-bg no-underline"
        >
          + New Album
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {withCounts.map((al) => (
          <div
            key={al.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5"
          >
            <div>
              <div className="font-serif text-[18px] font-bold text-green-dark">{al.title}</div>
              <div className="text-[13px] text-text-muted">
                {formatMonthYear(al.albumDate)} · {al.photoCount} photos
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/albums/${al.id}`} className="text-[13px] font-semibold text-green no-underline">
                Manage
              </Link>
              <form action={deleteAlbum.bind(null, al.id)}>
                <ConfirmSubmitButton confirmText={`Delete "${al.title}" and all its photos? This can't be undone.`}>
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {withCounts.length === 0 && <div className="text-[14px] text-text-muted">No albums yet.</div>}
      </div>
    </div>
  );
}
