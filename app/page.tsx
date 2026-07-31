import { asc, desc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import LivestreamSection from "@/components/LivestreamSection";
import SocialLinksGrid from "@/components/SocialLinksGrid";
import { getDb } from "@/lib/db";
import { events as eventsTable, sermons as sermonsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { getAboutContent, getHeroContent, getHomeHighlights, getLivestreamStatus, getSiteSettings } from "@/lib/settings";
import { to24Hour } from "@/lib/time";
import { nextWeeklyOccurrenceUTC } from "@/lib/timezone";

// Queries the DB and depends on the current time, so it must render fresh per
// request — static generation would freeze both at build time. This also
// sidesteps a PGlite issue in local dev: its file-locked WASM engine crashes
// when Next's parallel static-generation workers open it concurrently at build
// time (reproduced as "RuntimeError: Aborted()"); real Postgres in prod
// handles concurrent connections fine, but per-request rendering is correct
// either way for content that changes via the admin dashboard.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await getDb();
  const highlights = await getHomeHighlights();

  // Each of the 3 homepage cards prefers the admin's manual pick (see
  // /admin/hero), falling back to the most recent entry in that category —
  // the original always-automatic behavior.
  async function pickResource(category: string, pickedId: string | null) {
    if (pickedId) {
      const [picked] = await db.select().from(sermonsTable).where(eq(sermonsTable.id, pickedId));
      if (picked) return picked;
    }
    const [fallback] = await db
      .select()
      .from(sermonsTable)
      .where(eq(sermonsTable.category, category))
      .orderBy(desc(sermonsTable.date))
      .limit(1);
    return fallback;
  }

  const todayUTC = new Date().toISOString().slice(0, 10);
  const [latestSermon, latestThought, latestTeaching, [nextEvent]] = await Promise.all([
    pickResource("Sermon", highlights.sermonId),
    pickResource("Thought for the Week", highlights.thoughtId),
    pickResource("Bible Teachings", highlights.teachingId),
    db.select().from(eventsTable).where(gte(eventsTable.eventDate, todayUTC)).orderBy(asc(eventsTable.eventDate)).limit(1),
  ]);

  const livestream = await getLivestreamStatus();
  const [about, site, hero] = await Promise.all([getAboutContent(), getSiteSettings(), getHeroContent()]);

  const now = new Date();
  const nextServiceOccurrences = site.serviceTimes.map((t) => {
    const start24 = to24Hour(t.start);
    return nextWeeklyOccurrenceUTC(t.day, start24.hour, start24.minute, now, site.timezone);
  });
  const nextService = nextServiceOccurrences.length
    ? nextServiceOccurrences.reduce((soonest, d) => (d < soonest ? d : soonest))
    : null;

  return (
    <div>
      <HeroCarousel slides={hero.slides} />
      <LivestreamSection
        live={livestream.isLive}
        nextServiceIso={nextService?.toISOString() ?? null}
        zoomLink={about.zoomLink}
        streamingLocation={about.worshipPlace}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7 px-8 pb-16 pt-14">
        {latestSermon && (
          <Link
            href={`/sermons/${latestSermon.id}`}
            className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
          >
            <div
              className="h-[180px]"
              style={{ backgroundImage: `url(${latestSermon.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="p-[26px]">
              <div className="mb-2 text-[12px] tracking-[2px] text-gold uppercase">Latest Sermon</div>
              <div className="mb-2 font-serif text-[24px] font-bold text-green-dark">{latestSermon.title}</div>
              <div className="mb-3.5 text-[13px] text-text-muted">{formatDate(latestSermon.date)}</div>
              <div className="mb-4 text-[14px] leading-[1.6] text-text">{latestSermon.excerpt}</div>
              <div className="inline-block rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
                Watch / Read More →
              </div>
            </div>
          </Link>
        )}

        {nextEvent && (
          <Link
            href={`/events/${nextEvent.id}`}
            className="overflow-hidden rounded-[20px] border border-border bg-white no-underline"
          >
            <div className="h-[180px]" style={{ background: "linear-gradient(135deg,#C79A46,#8f6f2c)" }} />
            <div className="p-[26px]">
              <div className="mb-2 text-[12px] tracking-[2px] text-green uppercase">Next Event</div>
              <div className="mb-2 font-serif text-[24px] font-bold text-green-dark">{nextEvent.title}</div>
              <div className="mb-3.5 text-[13px] text-text-muted">
                {nextEvent.dateLabel || formatDate(nextEvent.eventDate)}
              </div>
              <div className="mb-4 text-[14px] leading-[1.6] text-text">{nextEvent.description}</div>
              <div className="inline-block rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
                See all events →
              </div>
            </div>
          </Link>
        )}

        {latestThought && (
          <Link
            href={`/sermons/${latestThought.id}`}
            className="flex flex-col rounded-[20px] border border-border bg-white p-[26px] no-underline"
          >
            <div className="mb-2 text-[12px] tracking-[2px] text-gold uppercase">Thought For The Week</div>
            <div className="mb-2 font-serif text-[20px] font-bold text-green-dark">{latestThought.title}</div>
            {latestThought.scripture && (
              <div className="mb-3.5 text-[13px] text-text-muted">{latestThought.scripture}</div>
            )}
            <div className="mb-4 text-[14px] leading-[1.6] text-text">{latestThought.excerpt}</div>
            <div className="mt-auto inline-block w-fit rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
              Read More →
            </div>
          </Link>
        )}

        {latestTeaching && (
          <Link
            href={`/sermons/${latestTeaching.id}`}
            className="flex flex-col rounded-[20px] border border-border bg-white p-[26px] no-underline"
          >
            <div className="mb-2 text-[12px] tracking-[2px] text-green uppercase">Bible Teachings</div>
            <div className="mb-2 font-serif text-[20px] font-bold text-green-dark">{latestTeaching.title}</div>
            {latestTeaching.scripture && (
              <div className="mb-3.5 text-[13px] text-text-muted">{latestTeaching.scripture}</div>
            )}
            <div className="mb-4 text-[14px] leading-[1.6] text-text">{latestTeaching.excerpt}</div>
            <div className="mt-auto inline-block w-fit rounded-full bg-green px-5 py-2.5 text-[14px] font-semibold text-bg">
              Read the study →
            </div>
          </Link>
        )}
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
