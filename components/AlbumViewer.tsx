"use client";

import { useEffect, useState } from "react";

type Photo = { id: string; caption: string; image: string; lightboxImage: string };

export default function AlbumViewer({ photos }: { photos: Photo[] }) {
  const [stackIndex, setStackIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const n = photos.length;

  useEffect(() => {
    const timer = setInterval(() => setStackIndex((i) => (i + 1) % n), 3000);
    return () => clearInterval(timer);
  }, [n]);

  const maxShow = Math.min(4, n);
  const stackPhotos = Array.from({ length: maxShow }, (_, k) => {
    const i = (stackIndex + k) % n;
    return { photo: photos[i], index: i, k };
  });

  const current = photos[stackIndex];
  const lightboxOpen = lightboxIndex !== null;
  const lightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <div className="relative mx-auto mb-10 h-[260px] w-[min(460px,78vw)] min-[880px]:h-[360px] min-[880px]:w-[min(460px,90vw)]">
        {stackPhotos.map(({ photo, index, k }) => (
          <div
            key={photo.id}
            onClick={() => (k === 0 ? setLightboxIndex(stackIndex) : setStackIndex(index))}
            className="absolute inset-0 cursor-pointer rounded-[20px] border border-white/60"
            style={{
              backgroundImage: `url(${photo.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 20px 40px rgba(20,22,18,0.2)",
              transform: `translate(${k * 16}px, ${k * 14}px) rotate(${k * 3}deg) scale(${1 - k * 0.05})`,
              zIndex: 40 - k * 10,
              opacity: 1 - k * 0.14,
              transition: "transform 0.4s cubic-bezier(.2,.8,.2,1), opacity 0.3s",
            }}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-[22px]">
        <button
          aria-label="Previous photo"
          onClick={() => setStackIndex((i) => (i + n - 1) % n)}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-[22px] text-green"
        >
          ‹
        </button>
        <div className="min-w-[140px] text-center">
          <div className="text-[13.5px] text-text">{current.caption}</div>
          <div className="mt-0.5 text-[12px] text-text-muted">
            {stackIndex + 1} / {n}
          </div>
        </div>
        <button
          aria-label="Next photo"
          onClick={() => setStackIndex((i) => (i + 1) % n)}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-[22px] text-green"
        >
          ›
        </button>
      </div>

      {lightboxOpen && lightboxPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,22,18,0.94)]">
          <button
            aria-label="Close"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-8 top-7 cursor-pointer text-[30px] text-bg-alt"
          >
            ×
          </button>
          <button
            aria-label="Previous photo"
            onClick={() => setLightboxIndex((i) => ((i as number) + n - 1) % n)}
            className="absolute left-6 cursor-pointer text-[34px] text-bg-alt"
          >
            ‹
          </button>
          <button
            aria-label="Next photo"
            onClick={() => setLightboxIndex((i) => ((i as number) + 1) % n)}
            className="absolute right-6 cursor-pointer text-[34px] text-bg-alt"
          >
            ›
          </button>
          <div
            className="flex w-[min(70vw,700px)] items-end justify-center rounded-2xl p-6"
            style={{
              aspectRatio: "4/3",
              backgroundImage: `url(${lightboxPhoto.lightboxImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="rounded-full bg-black/35 px-4 py-2 text-[14px] text-bg-alt">{lightboxPhoto.caption}</div>
          </div>
        </div>
      )}
    </>
  );
}
