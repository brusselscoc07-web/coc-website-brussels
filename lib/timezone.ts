// Everything the church schedules (services, events) is quoted in Brussels
// local time. Visitors join from anywhere, so every time we show gets paired
// with the viewer's own local time, computed dynamically in the browser —
// never hardcoded — so nobody has to do timezone math in their head.

export const BRUSSELS_TZ = "Europe/Brussels";

// Europe/Brussels shifts between CET (UTC+1) and CEST (UTC+2) on DST boundaries,
// so a fixed offset would be wrong roughly half the year. This asks the JS
// timezone database (via Intl) what Brussels' wall-clock time is at a given UTC
// instant, and reads off the actual offset in effect at that instant — no
// external timezone library needed.
function brusselsOffsetMinutesAt(utcGuess: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: BRUSSELS_TZ,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(utcGuess)
      .map((p) => [p.type, p.value]),
  );
  const asIfUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour === "24" ? "0" : parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return Math.round((asIfUTC - utcGuess.getTime()) / 60000);
}

// Converts a Brussels-local wall-clock date+time into the exact UTC instant it
// represents, correctly accounting for whichever of CET/CEST is in effect on
// that specific date.
export function brusselsLocalToUTC(year: number, month0: number, day: number, hour: number, minute: number): Date {
  const guess = new Date(Date.UTC(year, month0, day, hour, minute));
  const offsetMinutes = brusselsOffsetMinutesAt(guess);
  return new Date(guess.getTime() - offsetMinutes * 60000);
}

// Combines an ISO date ("YYYY-MM-DD", e.g. from an <input type="date">) with a
// display time ("12:30 PM") into the exact UTC instant, treating the time as
// Brussels local. Null when the time isn't a parseable clock time ("All day").
export function eventDateTimeFromISO(isoDate: string, timeDisplay: string): Date | null {
  const time = parseClockTime(timeDisplay);
  if (!time) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  return brusselsLocalToUTC(year, month - 1, day, time.hour, time.minute);
}

export type ParsedTime = { hour: number; minute: number };

// Parses the small set of time formats used across the site's seed data:
// "12:30 PM", "7:00 PM", "20:00", "20:00 - 21:30" (range -> start time only).
// Returns null for non-clock-time text ("All day", "Evenings") — those are
// intentionally left without a dual-timezone conversion.
export function parseClockTime(text: string): ParsedTime | null {
  const match = text.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// The next UTC instant at which Brussels local time reaches the given weekday/hour/minute.
export function nextWeeklyOccurrenceUTC(dayName: string, hour: number, minute: number, fromUTC: Date): Date {
  const targetDow = WEEKDAYS.indexOf(dayName.toLowerCase());
  if (targetDow === -1) throw new Error(`Unrecognized weekday: "${dayName}"`);

  for (let daysAhead = 0; daysAhead < 8; daysAhead++) {
    const candidateLocalDate = new Date(fromUTC.getTime() + daysAhead * 86400000);
    const brusselsParts = new Intl.DateTimeFormat("en-US", {
      timeZone: BRUSSELS_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    }).formatToParts(candidateLocalDate);
    const partsByType = Object.fromEntries(brusselsParts.map((p) => [p.type, p.value]));
    if (partsByType.weekday!.toLowerCase() !== WEEKDAYS[targetDow]) continue;

    const candidateUTC = brusselsLocalToUTC(
      Number(partsByType.year),
      Number(partsByType.month) - 1,
      Number(partsByType.day),
      hour,
      minute,
    );
    if (candidateUTC.getTime() > fromUTC.getTime()) return candidateUTC;
  }

  throw new Error(`Could not find next occurrence of ${dayName} ${hour}:${minute}`);
}
