import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import LivestreamSection from "@/components/LivestreamSection";
import SocialLinksGrid from "@/components/SocialLinksGrid";
import { events, sermons, sermonImage, thoughtForTheWeek } from "@/lib/data";

export default function HomePage() {
  const latestSermon = sermons[0];
  const nextEvent = events.find((e) => !e.past);

  return (
    <div>
      <HeroCarousel />
      <LivestreamSection />

      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7 px-8 pb-16 pt-14">
        <Link
          href={`/sermons/${latestSermon.id}`}
          className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
        >
          <div
            className="h-[180px]"
            style={{ backgroundImage: `url(${sermonImage(latestSermon.id)})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="p-[26px]">
            <div className="mb-2 text-[12px] tracking-[2px] text-gold uppercase">Latest Sermon</div>
            <div className="mb-2 font-serif text-[24px] font-bold text-green-dark">{latestSermon.title}</div>
            <div className="mb-3.5 text-[13px] text-text-muted">{latestSermon.date}</div>
            <div className="mb-4 text-[14px] leading-[1.6] text-text">{latestSermon.excerpt}</div>
            <div className="inline-block rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
              Watch / Read More →
            </div>
          </div>
        </Link>

        {nextEvent && (
          <Link
            href={`/events/${nextEvent.id}`}
            className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
          >
            <div className="h-[180px]" style={{ background: "linear-gradient(135deg,#C79A46,#8f6f2c)" }} />
            <div className="p-[26px]">
              <div className="mb-2 text-[12px] tracking-[2px] text-green uppercase">Next Event</div>
              <div className="mb-2 font-serif text-[24px] font-bold text-green-dark">{nextEvent.title}</div>
              <div className="mb-3.5 text-[13px] text-text-muted">{nextEvent.date}</div>
              <div className="mb-4 text-[14px] leading-[1.6] text-text">{nextEvent.desc}</div>
              <div className="inline-block rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
                See all events →
              </div>
            </div>
          </Link>
        )}

        <div className="flex flex-col rounded-[20px] border border-border bg-white p-[26px]">
          <div className="mb-2 text-[12px] tracking-[2px] text-gold uppercase">Thought For The Week</div>
          <div className="mb-4 font-serif text-[20px] font-bold italic leading-[1.55] text-green-dark">
            {thoughtForTheWeek.quote}
          </div>
          <div className="mt-auto text-[13px] text-text-muted">{thoughtForTheWeek.ref}</div>
        </div>
      </div>

      <div className="bg-bg-alt px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 text-center">
            <div className="mb-2 text-[13px] tracking-[3px] text-gold uppercase">Stay Connected</div>
            <div className="font-serif text-[32px] font-bold text-green-dark">Follow Us Online</div>
          </div>
          <SocialLinksGrid />
        </div>
      </div>
    </div>
  );
}
