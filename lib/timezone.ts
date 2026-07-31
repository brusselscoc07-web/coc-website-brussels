// Everything the church schedules (services, events) is quoted in Brussels
// local time. Visitors join from anywhere, so every time we show gets paired
// with the viewer's own local time, computed dynamically in the browser —
// never hardcoded — so nobody has to do timezone math in their head.

export const BRUSSELS_TZ = "Europe/Brussels";

// A short, curated list — not every IANA zone, just the ones a Brussels
// congregation with a diaspora following would plausibly pick. Falls back to
// BRUSSELS_TZ anywhere a stored value doesn't match one of these (e.g. old data).
export const CHURCH_TIMEZONES = [
  { value: "Europe/Brussels", label: "Brussels (CET/CEST)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Africa/Accra", label: "Accra (GMT)" },
  { value: "Africa/Lagos", label: "Lagos (WAT)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "UTC", label: "UTC" },
] as const;

// Any timezone shifts between standard and daylight time on DST boundaries, so
// a fixed offset would be wrong part of the year. This asks the JS timezone
// database (via Intl) what that zone's wall-clock time is at a given UTC
// instant, and reads off the actual offset in effect at that instant — no
// external timezone library needed.
function offsetMinutesAt(timeZone: string, utcGuess: Date): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
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

// Converts a local wall-clock date+time in the given IANA timezone into the
// exact UTC instant it represents, correctly accounting for whichever
// standard/daylight offset is in effect on that specific date. Defaults to
// Brussels for the many call sites that only ever dealt with one timezone.
export function localToUTC(
  year: number,
  month0: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = BRUSSELS_TZ,
): Date {
  const guess = new Date(Date.UTC(year, month0, day, hour, minute));
  const offsetMinutes = offsetMinutesAt(timeZone, guess);
  return new Date(guess.getTime() - offsetMinutes * 60000);
}

// Kept as a thin, Brussels-specific alias — most existing call sites (events)
// are intentionally always Brussels time, only the church-wide service-time
// clock is timezone-selectable (see Site Settings).
export function brusselsLocalToUTC(year: number, month0: number, day: number, hour: number, minute: number): Date {
  return localToUTC(year, month0, day, hour, minute, BRUSSELS_TZ);
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

// The next UTC instant at which the given timezone's local time reaches the
// given weekday/hour/minute. Defaults to Brussels for existing call sites.
export function nextWeeklyOccurrenceUTC(
  dayName: string,
  hour: number,
  minute: number,
  fromUTC: Date,
  timeZone: string = BRUSSELS_TZ,
): Date {
  const targetDow = WEEKDAYS.indexOf(dayName.toLowerCase());
  if (targetDow === -1) throw new Error(`Unrecognized weekday: "${dayName}"`);

  for (let daysAhead = 0; daysAhead < 8; daysAhead++) {
    const candidateLocalDate = new Date(fromUTC.getTime() + daysAhead * 86400000);
    const zoneParts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    }).formatToParts(candidateLocalDate);
    const partsByType = Object.fromEntries(zoneParts.map((p) => [p.type, p.value]));
    if (partsByType.weekday!.toLowerCase() !== WEEKDAYS[targetDow]) continue;

    const candidateUTC = localToUTC(
      Number(partsByType.year),
      Number(partsByType.month) - 1,
      Number(partsByType.day),
      hour,
      minute,
      timeZone,
    );
    if (candidateUTC.getTime() > fromUTC.getTime()) return candidateUTC;
  }

  throw new Error(`Could not find next occurrence of ${dayName} ${hour}:${minute}`);
}
