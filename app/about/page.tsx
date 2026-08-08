import type { Metadata } from "next";
import Link from "next/link";
import DualTimezoneTime from "@/components/DualTimezoneTime";
import { getAboutContent, getSiteSettings } from "@/lib/settings";
import { formatTime12h, to24Hour } from "@/lib/time";
import { CHURCH_TIMEZONES, nextWeeklyOccurrenceUTC } from "@/lib/timezone";

export const metadata: Metadata = {
  title: "About Us — Church of Christ Brussels",
};

// Now reads from the database (About + Site settings, edited at /admin/about
// and /admin/settings), so it must render fresh per request rather than as a
// static/ISR page — see the note on app/page.tsx's `dynamic` export for the
// PGlite reasoning.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [about, site] = await Promise.all([getAboutContent(), getSiteSettings()]);
  const now = new Date();
  const tzLabel = CHURCH_TIMEZONES.find((tz) => tz.value === site.timezone)?.label ?? site.timezone;
  const worshipTimes = site.serviceTimes.map((t) => {
    const start24 = to24Hour(t.start);
    const nextOccurrenceIso = nextWeeklyOccurrenceUTC(
      t.day,
      start24.hour,
      start24.minute,
      now,
      site.timezone,
    ).toISOString();
    const display = t.end ? `${formatTime12h(t.start)} – ${formatTime12h(t.end)}` : formatTime12h(t.start);
    return { ...t, display, nextOccurrenceIso };
  });

  return (
    <div className="mx-auto max-w-[1000px] px-8 py-20">
      <div className="mb-14 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Who We Are</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">About Us</div>
      </div>

      <div className="mb-16 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10">
        <div>
          <div className="mb-3 font-serif text-[22px] font-bold text-green">What We Believe</div>
          <div className="text-[15px] leading-[1.8] text-text">{about.statement}</div>
        </div>
        <div>
          <div className="mb-3 font-serif text-[22px] font-bold text-green">The Plan of Salvation</div>
          <div className="text-[15px] leading-[1.8] text-text">{about.planOfSalvation}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-7 rounded-[20px] border border-border bg-white p-9">
        <div
          className="h-24 w-24 shrink-0 rounded-full"
          style={{ background: "linear-gradient(135deg,#2C4A3D,#C79A46)" }}
        />
        <div>
          <div className="font-serif text-[24px] font-bold text-green-dark">{about.preacher}</div>
          <div className="my-1.5 text-[13px] tracking-[2px] text-gold uppercase">Preaching Minister</div>
          <div className="text-[14px] leading-[1.7] text-text">{about.preacherBio}</div>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-14">
        <div className="mb-12 text-center">
          <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Come Worship</div>
          <div className="font-serif text-[42px] font-bold text-green-dark">Join Us</div>
        </div>
        <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12">
          <div className="flex h-full flex-col">
            <div className="mb-5 font-serif text-[26px] font-bold text-green">Our worship consists of</div>
            <div className="flex flex-1 flex-col justify-start gap-[22px]">
              {about.worshipItems.map((wi, i) => (
                <div key={wi.id} className="flex items-baseline gap-4">
                  <span className="font-serif text-[22px] font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[18px] text-ink-soft">{wi.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-white p-7">
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Worship Place</div>
              <div className="text-[15px] text-green-dark">{about.worshipPlace}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Preacher</div>
              <div className="text-[15px] text-green-dark">{about.preacher}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Address</div>
              <div className="text-[15px] text-green-dark">{site.address}</div>
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Times</div>
              {worshipTimes.map((t) => (
                <div key={t.id} className="mb-1.5 last:mb-0">
                  <div className="text-[15px] text-green-dark">
                    {t.day}: {t.display} <span className="text-text-muted">{tzLabel}</span>
                  </div>
                  <div className="text-[12.5px] text-text-muted">
                    Starts <DualTimezoneTime iso={t.nextOccurrenceIso} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 text-[11px] tracking-[1.5px] text-gold uppercase">Zoom</div>
              <a
                href={about.zoomLink || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[15px] font-semibold text-green no-underline"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                  <rect width="24" height="24" rx="6" fill="#2D8CFF" />
                  <path
                    d="M6 9a1.5 1.5 0 011.5-1.5h6A1.5 1.5 0 0115 9v6a1.5 1.5 0 01-1.5 1.5h-6A1.5 1.5 0 016 15z"
                    fill="#fff"
                  />
                  <path d="M15.5 10.3l2.6-1.6a.7.7 0 011.1.6v5.4a.7.7 0 01-1.1.6l-2.6-1.6z" fill="#fff" />
                </svg>
                Join on Zoom →
              </a>
              <div className="mt-0.5 text-[12px] text-text-muted">{about.zoomNote}</div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="mb-6 font-serif text-[20px] italic text-text">
            You are warmly invited to worship with us — come as you are, you belong here.
          </div>
          <Link
            href="/contact"
            className="inline-block cursor-pointer rounded-full bg-green px-8 py-3.5 text-[14px] font-semibold text-bg no-underline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
