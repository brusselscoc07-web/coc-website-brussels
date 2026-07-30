import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumViewer from "@/components/AlbumViewer";
import { getDb } from "@/lib/db";
import { albums as albumsTable, photos as photosTable } from "@/lib/db/schema";
import { formatMonthYear } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ albumId: string }> }): Promise<Metadata> {
  const { albumId } = await params;
  const db = await getDb();
  const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, albumId));
  return { title: album ? `${album.title} — Church of Christ Brussels` : "Album — Church of Christ Brussels" };
}

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const db = await getDb();
  const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, albumId));
  if (!album) notFound();

  const albumPhotos = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.albumId, album.id))
    .orderBy(asc(photosTable.sortOrder));

  const photos = albumPhotos.map((ph) => ({
    id: ph.id,
    caption: ph.caption || "",
    image: ph.url,
    lightboxImage: ph.url,
  }));

  return (
    <div className="mx-auto max-w-6xl px-8 py-20">
      <Link
        href="/gallery"
        className="inline-block cursor-pointer rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-semibold text-green no-underline"
      >
        ← All Albums
      </Link>
      <div className="mb-2 mt-5 font-serif text-[38px] font-bold text-green-dark">{album.title}</div>
      <div className="mb-9 text-[13px] text-text-muted">{formatMonthYear(album.albumDate)}</div>
      <AlbumViewer photos={photos} />
    </div>
  );
}
