import { desc, eq, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { albums as albumsTable, photos as photosTable } from "@/lib/db/schema";
import { formatMonthYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "Gallery — Church of Christ Brussels",
};

// Queries the DB, so it must render per request rather than at build time —
// see app/page.tsx for why (PGlite's file-locked engine crashes under Next's
// parallel static-generation workers).
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const db = await getDb();
  const albums = await db.select().from(albumsTable).orderBy(desc(albumsTable.albumDate));

  const albumsWithCover = await Promise.all(
    albums.map(async (al) => {
      const [cover] = await db
        .select()
        .from(photosTable)
        .where(eq(photosTable.albumId, al.id))
        .orderBy(photosTable.sortOrder)
        .limit(1);
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(photosTable)
        .where(eq(photosTable.albumId, al.id));
      return { ...al, coverUrl: cover?.url, photoCount: count };
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-8 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Church Life</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">Gallery</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
        {albumsWithCover.map((al) => (
          <Link
            key={al.id}
            href={`/gallery/${al.id}`}
            className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
          >
            <div
              className="h-[200px]"
              style={{ backgroundImage: `url(${al.coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="px-[22px] py-5">
              <div className="mb-1.5 font-serif text-[20px] font-bold text-green-dark">{al.title}</div>
              <div className="text-[13px] text-text-muted">
                {formatMonthYear(al.albumDate)} · {al.photoCount} photos
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
