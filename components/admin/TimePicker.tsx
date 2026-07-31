"use client";

import type { TimeValue } from "@/lib/time";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const selectClass = "w-[84px] rounded-[8px] border border-[#CBD9E5] bg-white px-3 py-3 text-[14px]";
const periodSelectClass = "w-[76px] rounded-[8px] border border-[#CBD9E5] bg-white px-3 py-3 text-[14px]";

export default function TimePicker({ value, onChange }: { value: TimeValue; onChange: (next: TimeValue) => void }) {
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Hour"
        value={value.hour}
        onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })}
        className={selectClass}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-[14px] text-[#7C93AA]">:</span>
      <select
        aria-label="Minute"
        value={value.minute}
        onChange={(e) => onChange({ ...value, minute: Number(e.target.value) })}
        className={selectClass}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </select>
      <select
        aria-label="AM or PM"
        value={value.period}
        onChange={(e) => onChange({ ...value, period: e.target.value as "AM" | "PM" })}
        className={periodSelectClass}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
