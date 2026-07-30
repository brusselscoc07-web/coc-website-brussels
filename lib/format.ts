const displayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return displayFormatter.format(date);
}

const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// For dates that only ever carry month/year precision (e.g. photo albums,
// stored with a synthetic day-of-month) — avoids implying a false-precise day.
export function formatMonthYear(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return monthYearFormatter.format(date);
}

const badgeMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

export function formatEventBadge(value: string | Date): { day: string; month: string } {
  const date = typeof value === "string" ? new Date(value) : value;
  return {
    day: String(date.getUTCDate()),
    month: badgeMonthFormatter.format(date).toUpperCase(),
  };
}
