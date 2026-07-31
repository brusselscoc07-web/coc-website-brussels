import Link from "next/link";
import DualTimezoneTime from "@/components/DualTimezoneTime";

// `live` is the real, admin-toggled status from the settings table (see
// app/admin/(authenticated)/livestream/) — no more local preview-switch state.
export default function LivestreamSection({
  live,
  nextServiceIso,
  zoomLink,
  streamingLocation,
}: {
  live: boolean;
  nextServiceIso: string | null;
  zoomLink?: string;
  streamingLocation?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-8 pt-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 text-[13px] tracking-[3px] text-gold uppercase">Worship With Us</div>
          <div className="font-serif text-[34px] font-bold text-green-dark">Livestream</div>
        </div>
      </div>

      {live ? (
        <a
          href={zoomLink || "#"}
          target="_blank"
          rel="noreferrer"
          className="relative block overflow-hidden rounded-[20px] no-underline"
          style={{
            aspectRatio: "16/9",
            backgroundImage:
              "linear-gradient(180deg,rgba(10,12,10,0.2),rgba(10,12,10,0.6)),url(https://picsum.photos/seed/zoom-live/1000/560)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-5 top-5 z-[2] flex items-center gap-2 rounded-full bg-live px-4 py-2 text-[13px] font-semibold text-white">
            <span className="animate-pulse-live inline-block h-2 w-2 rounded-full bg-white" />
            🔴 LIVE NOW
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(37,101,200,0.85)]">
            <span className="ml-1.5 inline-block border-y-[14px] border-l-[22px] border-y-transparent border-l-white" />
          </div>
          {streamingLocation && (
            <div className="absolute bottom-5 left-5 text-[13px] text-gold-light">Streaming from {streamingLocation}</div>
          )}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px] text-white">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#2D8CFF" />
              <path
                d="M6 9a1.5 1.5 0 011.5-1.5h6A1.5 1.5 0 0115 9v6a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 016 15z"
                fill="#fff"
              />
              <path d="M15.5 10.3l2.6-1.6a.7.7 0 011.1.6v5.4a.7.7 0 01-1.1.6l-2.6-1.6z" fill="#fff" />
            </svg>
            Join on Zoom
          </div>
        </a>
      ) : (
        <div className="rounded-[20px] border border-border bg-white p-12 text-center">
          <div className="mb-2.5 text-[15px] text-text-muted">We&apos;re not live right now</div>
          <div className="mb-5 font-serif text-[26px] font-bold text-green-dark">
            {nextServiceIso ? (
              <>
                Next service: <DualTimezoneTime iso={nextServiceIso} />
              </>
            ) : (
              "Check our schedule for the next service"
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link href="/sermons" className="cursor-pointer rounded-full bg-green px-6 py-3 text-[14px] text-bg no-underline">
              Watch past sermons
            </Link>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-[1.5px] border-green px-6 py-3 text-[14px] text-green no-underline"
            >
              Visit our YouTube
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
