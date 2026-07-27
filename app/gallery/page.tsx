import type { Metadata } from "next";
import Link from "next/link";
import { albumImage, albums } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery — Church of Christ Brussels",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-20">
      <div className="mb-12 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Church Life</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">Gallery</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
        {albums.map((al) => (
          <Link
            key={al.id}
            href={`/gallery/${al.id}`}
            className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
          >
            <div
              className="h-[200px]"
              style={{ backgroundImage: `url(${albumImage(al.id)})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="px-[22px] py-5">
              <div className="mb-1.5 font-serif text-[20px] font-bold text-green-dark">{al.title}</div>
              <div className="text-[13px] text-text-muted">
                {al.date} · {al.photos.length} photos
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
