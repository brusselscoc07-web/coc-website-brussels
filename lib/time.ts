// Shared 12-hour time value used by admin time pickers (see
// components/admin/TimePicker.tsx) — kept separate from the 24-hour
// hour/minute shape lib/timezone.ts's DST math expects, with small converters
// between the two so pickers stay simple while the timezone math stays correct.
export type TimeValue = { hour: number; minute: number; period: "AM" | "PM" };

export const DEFAULT_TIME: TimeValue = { hour: 12, minute: 0, period: "PM" };

export function to24Hour(t: TimeValue): { hour: number; minute: number } {
  let hour = t.hour % 12;
  if (t.period === "PM") hour += 12;
  return { hour, minute: t.minute };
}

export function from24Hour(hour24: number, minute: number): TimeValue {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return { hour, minute, period };
}

export function formatTime12h(t: TimeValue): string {
  return `${t.hour}:${String(t.minute).padStart(2, "0")} ${t.period}`;
}
