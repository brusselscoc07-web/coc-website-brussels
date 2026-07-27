import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AlbumViewer from "@/components/AlbumViewer";
import { albums, photoImage } from "@/lib/data";

export function generateStaticParams() {
  return albums.map((al) => ({ albumId: al.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ albumId: string }> }): Promise<Metadata> {
  const { albumId } = await params;
  const album = albums.find((a) => a.id === albumId);
  return { title: album ? `${album.title} — Church of Christ Brussels` : "Album — Church of Christ Brussels" };
}

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = albums.find((a) => a.id === albumId);
  if (!album) notFound();

  const photos = album.photos.map((ph) => ({
    id: ph.id,
    caption: ph.caption,
    image: photoImage(album.id, ph.id, "700/560"),
    lightboxImage: photoImage(album.id, ph.id, "900/700"),
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
      <div className="mb-9 text-[13px] text-text-muted">{album.date}</div>
      <AlbumViewer photos={photos} />
    </div>
  );
}
