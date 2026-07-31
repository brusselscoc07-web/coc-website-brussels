import { eq, sql } from "drizzle-orm";
import type { SocialLink } from "./data";
import { getDb } from "./db";
import { settings } from "./db/schema";
import { BRUSSELS_TZ } from "./timezone";
import type { TimeValue } from "./time";

export type LivestreamSetting = { isLive: boolean; toggledBy?: string; toggledAt?: string };

export async function getLivestreamStatus(): Promise<LivestreamSetting> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "livestream"));
  return (row?.value as LivestreamSetting) ?? { isLive: false };
}

export type WorshipItem = { id: string; label: string };
export type AboutSetting = {
  statement: string;
  worshipItems: WorshipItem[];
  worshipPlace: string;
  preacher: string;
  zoomLink: string;
  zoomNote: string;
};

// Mirrors the content that was hardcoded in lib/data.ts / app/about/page.tsx
// before the About page became DB-backed, so nothing changes visually until
// an admin actually saves an edit in /admin/about.
const DEFAULT_ABOUT: AboutSetting = {
  statement:
    "We have no creed but Christ, no book but the Bible. We seek to be simply Christians, wearing no denominational name and holding only to the teaching of the New Testament as our guide for faith and practice.",
  worshipItems: [
    { id: "wi1", label: "Prayer" },
    { id: "wi2", label: "Singing" },
    { id: "wi3", label: "Preaching & Teaching" },
    { id: "wi4", label: "The Lord's Supper" },
    { id: "wi5", label: "Contributing" },
  ],
  worshipPlace: "Shalom Center",
  preacher: "Bro. Joseph Acheampong",
  zoomLink: "https://zoom.us/j/1234567890",
  zoomNote: "Same as worship time",
};

export type ServiceTime = { id: string; day: string; start: TimeValue; end?: TimeValue | null };
export type SiteSetting = {
  address: string;
  phone: string;
  hours: string;
  tagline: string;
  email: string;
  timezone: string;
  serviceTimes: ServiceTime[];
  socialLinks: SocialLink[];
};

// Same reasoning as DEFAULT_ABOUT — mirrors lib/data.ts's `location`/`socialLinks`
// and components/SiteFooter.tsx's hardcoded tagline, so nothing visually
// changes until an admin saves an edit in /admin/settings.
const DEFAULT_SITE: SiteSetting = {
  address: "Rue Madyol 5, 1200 Brussels, Belgium",
  phone: "+32 2 123 45 67",
  hours: "Monday – Friday, 9:00am – 5:00pm (GMT+1)",
  tagline: "A family of faith devoted to Scripture, worship, and one another.",
  email: "",
  timezone: BRUSSELS_TZ,
  serviceTimes: [
    { id: "st1", day: "Friday", start: { hour: 8, minute: 0, period: "PM" }, end: { hour: 9, minute: 30, period: "PM" } },
    { id: "st2", day: "Sunday", start: { hour: 12, minute: 30, period: "PM" }, end: { hour: 3, minute: 0, period: "PM" } },
  ],
  socialLinks: [
    { key: "youtube", label: "YouTube", handle: "@cocbrussels", note: "Watch our sermons", url: "https://youtube.com" },
    {
      key: "facebook",
      label: "Facebook",
      handle: "Church of Christ Brussels",
      note: "Follow our page",
      url: "https://facebook.com",
    },
    {
      key: "instagram",
      label: "Instagram",
      handle: "@cocbrussels",
      note: "See our latest moments",
      url: "https://instagram.com",
    },
    { key: "whatsapp", label: "WhatsApp", handle: "+32 2 123 45 67", note: "Chat with us", url: "https://wa.me/3221234567" },
  ],
};

export async function upsertSetting(key: string, value: unknown) {
  const db = await getDb();
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: sql`now()` } });
}

export async function getAboutContent(): Promise<AboutSetting> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "about"));
  return (row?.value as AboutSetting | undefined) ?? DEFAULT_ABOUT;
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "site"));
  return (row?.value as SiteSetting | undefined) ?? DEFAULT_SITE;
}

// The 3 cards below the homepage hero banner. Each slot holds the id of a
// specific sermons-table row (one per category) an admin picked in
// /admin/hero. Null means "not picked yet" — the homepage falls back to the
// most recent entry in that category, exactly like it always has, so this
// feature is opt-in with zero regression.
export type HomeHighlights = {
  sermonId: string | null;
  thoughtId: string | null;
  teachingId: string | null;
};

const DEFAULT_HOME_HIGHLIGHTS: HomeHighlights = { sermonId: null, thoughtId: null, teachingId: null };

export async function getHomeHighlights(): Promise<HomeHighlights> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "homeHighlights"));
  return (row?.value as HomeHighlights | undefined) ?? DEFAULT_HOME_HIGHLIGHTS;
}

export type HeroSlide = { id: string; headline: string; sub: string; imageUrl?: string | null };
export type HeroSetting = { slides: HeroSlide[] };

// Mirrors lib/data.ts's old static `heroSlides` array, minus the gradient
// (the public carousel falls back to lib/data.ts's `gradients` palette for
// any slide with no uploaded image — see components/HeroCarousel.tsx).
const DEFAULT_HERO: HeroSetting = {
  slides: [
    { id: "default-1", headline: "You Are Welcome Here", sub: "A family of faith in the heart of Brussels." },
    { id: "default-2", headline: "Grow in the Word", sub: "Teaching and fellowship rooted in Scripture." },
    { id: "default-3", headline: "Come As You Are", sub: "Join us this Friday and Sunday for worship." },
  ],
};

export async function getHeroContent(): Promise<HeroSetting> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "hero"));
  return (row?.value as HeroSetting | undefined) ?? DEFAULT_HERO;
}
