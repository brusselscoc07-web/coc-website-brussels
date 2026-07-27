import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SermonInteractive from "@/components/SermonInteractive";
import { mockComments, sermonImage, sermons } from "@/lib/data";

export function generateStaticParams() {
  return sermons.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sermon = sermons.find((s) => s.id === slug);
  return { title: sermon ? `${sermon.title} — Church of Christ Brussels` : "Sermon — Church of Christ Brussels" };
}

export default async function SermonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = sermons.find((s) => s.id === slug);
  if (!sermon) notFound();

  const videoUrl = sermon.videoUrl || "https://youtube.com";

  return (
    <div className="mx-auto max-w-[820px] px-8 py-20">
      <Link
        href="/sermons"
        className="inline-block cursor-pointer rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-semibold text-green no-underline"
      >
        ← All Posts
      </Link>
      <div className="mb-3 mt-5 font-serif text-[38px] font-bold text-green-dark">{sermon.title}</div>
      <div className="mb-7 flex flex-wrap gap-3.5 text-[13px] text-text-muted">
        <span>{sermon.date}</span>
        <span>·</span>
        <span>{sermon.preacher}</span>
        <span>·</span>
        <span>{sermon.scripture}</span>
      </div>

      {sermon.hasVideo && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="relative mb-8 block overflow-hidden rounded-2xl no-underline"
          style={{
            aspectRatio: "16/9",
            backgroundImage: `linear-gradient(180deg,rgba(10,12,10,0.15),rgba(10,12,10,0.6)),url(${sermonImage(sermon.id, "1000/560")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-4 right-4 top-4 flex items-center gap-2.5">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gold text-[15px] font-bold text-green-dark">
              C
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">{sermon.title}</div>
              <div className="text-[12px] text-bg-alt">Church of Christ Brussels</div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-11 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] bg-[#FF0000]">
            <span className="ml-1 inline-block border-y-[11px] border-l-[17px] border-y-transparent border-l-white" />
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px] text-white">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#FF0000" />
              <path d="M9.5 8.3l6.2 3.7-6.2 3.7z" fill="#fff" />
            </svg>
            Watch on YouTube
          </div>
        </a>
      )}

      <div className="mb-9 flex flex-col gap-[18px] text-[16px] leading-[1.85] text-ink-soft">
        {sermon.body.map((para, i) => (
          <p key={i} className="m-0">
            {para}
          </p>
        ))}
      </div>

      <SermonInteractive shareUrl={videoUrl} comments={mockComments[sermon.id] || []} />
    </div>
  );
}
