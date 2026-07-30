import { sql } from "drizzle-orm";
import {
  albums as albumSeed,
  eventImage,
  events as eventSeed,
  photoImage,
  sermonImage,
  sermons as sermonSeed,
} from "../lib/data";
import { getDb } from "../lib/db";
import { albums, events, photos, sermons } from "../lib/db/schema";
import { brusselsLocalToUTC, parseClockTime } from "../lib/timezone";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// `new Date("August 2, 2026")` parses as LOCAL midnight, so its UTC ISO string
// can land on the previous day depending on the server's timezone (reproduced:
// CEST shifted every seeded date back by one day). Parse the components by hand
// and build via Date.UTC so seeding is deterministic regardless of server TZ.
// Handles three shapes seen in the seed data: "August 2, 2026" (single day),
// "August 14-16, 2026" (multi-day range — takes the first day), and "June 2026"
// (album month/year only — defaults to the 1st).
function parseNaturalDateParts(display: string): { year: number; monthIndex: number; day: number } {
  const withDay = display.match(/^([A-Za-z]+)\s+(\d{1,2})(?:[–-]\d{1,2})?,\s*(\d{4})$/);
  const monthYearOnly = display.match(/^([A-Za-z]+)\s+(\d{4})$/);
  const [monthName, day, year] = withDay
    ? [withDay[1], withDay[2], withDay[3]]
    : monthYearOnly
      ? [monthYearOnly[1], "1", monthYearOnly[2]]
      : [];
  if (!monthName) throw new Error(`Unrecognized date format: "${display}"`);
  const monthIndex = MONTHS.indexOf(monthName.toLowerCase());
  if (monthIndex === -1) throw new Error(`Unrecognized month in date: "${display}"`);
  return { year: Number(year), monthIndex, day: Number(day) };
}

function parseNaturalDateUTC(display: string): string {
  const { year, monthIndex, day } = parseNaturalDateParts(display);
  return new Date(Date.UTC(year, monthIndex, day)).toISOString().slice(0, 10);
}

// Combines the event's start date with its time-of-day (when the time is a
// parseable clock time, e.g. "12:30 PM") into an exact UTC instant, treating
// the time as Brussels local — so the site can show it converted to each
// visitor's own timezone. Null for non-clock times like "All day"/"Evenings".
function eventStartInstant(dateDisplay: string, timeDisplay: string): Date | null {
  const time = parseClockTime(timeDisplay);
  if (!time) return null;
  const { year, monthIndex, day } = parseNaturalDateParts(dateDisplay);
  return brusselsLocalToUTC(year, monthIndex, day, time.hour, time.minute);
}

async function main() {
  const db = await getDb();

  for (const s of sermonSeed) {
    await db
      .insert(sermons)
      .values({
        id: s.id,
        title: s.title,
        date: parseNaturalDateUTC(s.date),
        preacher: s.preacher,
        scripture: s.scripture,
        category: s.category,
        excerpt: s.excerpt,
        body: s.body,
        hasVideo: s.hasVideo,
        videoUrl: s.videoUrl,
        imageUrl: sermonImage(s.id),
      })
      .onConflictDoUpdate({
        target: sermons.id,
        set: {
          title: s.title,
          date: parseNaturalDateUTC(s.date),
          preacher: s.preacher,
          scripture: s.scripture,
          category: s.category,
          excerpt: s.excerpt,
          body: s.body,
          hasVideo: s.hasVideo,
          videoUrl: s.videoUrl,
          imageUrl: sermonImage(s.id),
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`Seeded ${sermonSeed.length} sermons.`);

  for (const e of eventSeed) {
    const eventDateTime = eventStartInstant(e.date, e.time);
    await db
      .insert(events)
      .values({
        id: e.id,
        title: e.title,
        eventDate: parseNaturalDateUTC(e.date),
        dateLabel: e.date,
        eventTime: e.time,
        eventDateTime,
        description: e.desc,
        location: e.location || null,
        imageUrl: eventImage(e.id),
      })
      .onConflictDoUpdate({
        target: events.id,
        set: {
          title: e.title,
          eventDate: parseNaturalDateUTC(e.date),
          dateLabel: e.date,
          eventTime: e.time,
          eventDateTime,
          description: e.desc,
          location: e.location || null,
          imageUrl: eventImage(e.id),
          updatedAt: sql`now()`,
        },
      });
  }
  console.log(`Seeded ${eventSeed.length} events.`);

  for (const al of albumSeed) {
    await db
      .insert(albums)
      .values({ id: al.id, title: al.title, albumDate: parseNaturalDateUTC(al.date) })
      .onConflictDoUpdate({
        target: albums.id,
        set: { title: al.title, albumDate: parseNaturalDateUTC(al.date) },
      });

    for (const [index, ph] of al.photos.entries()) {
      await db
        .insert(photos)
        .values({
          id: ph.id,
          albumId: al.id,
          url: photoImage(al.id, ph.id),
          caption: ph.caption,
          sortOrder: index,
        })
        .onConflictDoUpdate({
          target: photos.id,
          set: { url: photoImage(al.id, ph.id), caption: ph.caption, sortOrder: index },
        });
    }
  }
  console.log(`Seeded ${albumSeed.length} albums (${albumSeed.reduce((n, a) => n + a.photos.length, 0)} photos).`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
