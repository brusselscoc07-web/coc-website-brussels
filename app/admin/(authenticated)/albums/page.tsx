import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import Topbar from "@/components/admin/Topbar";
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
    <div>
      <Topbar title="Gallery" subtitle="Photo albums shown on the Gallery page" />
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
          <Link
            href="/admin/albums/new"
            className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline"
          >
            + New Album
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {withCounts.map((al) => (
            <div
              key={al.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#DCE7F0] bg-white p-4"
            >
              <div>
                <div className="text-[15px] font-semibold text-[#16233A]">{al.title}</div>
                <div className="text-[13px] text-[#7C93AA]">
                  {formatMonthYear(al.albumDate)} · {al.photoCount} photos
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/albums/${al.id}`} className="text-[13px] font-semibold text-[#2E90D9] no-underline">
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
          {withCounts.length === 0 && <div className="text-[14px] text-[#7C93AA]">No albums yet.</div>}
        </div>
      </div>
    </div>
  );
}
