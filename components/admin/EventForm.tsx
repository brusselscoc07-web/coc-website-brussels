"use client";

import { useActionState, useState } from "react";
import { createEvent, updateEvent, type EventFormState } from "@/app/admin/(authenticated)/events/actions";
import { DEFAULT_TIME, formatTime12h, from24Hour, type TimeValue } from "@/lib/time";
import { parseClockTime } from "@/lib/timezone";
import ImageFileInput from "./ImageFileInput";
import TimePicker from "./TimePicker";

type EventRow = {
  id: string;
  title: string;
  eventDate: string;
  dateLabel: string | null;
  eventTime: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
};

const initialState: EventFormState = {};

const inputClass = "w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";

export default function EventForm({ event }: { event?: EventRow }) {
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const existingClock = event ? parseClockTime(event.eventTime) : null;
  const [mode, setMode] = useState<"specific" | "custom">(existingClock || !event ? "specific" : "custom");
  const [time, setTime] = useState<TimeValue>(existingClock ? from24Hour(existingClock.hour, existingClock.minute) : DEFAULT_TIME);
  const [customLabel, setCustomLabel] = useState(existingClock || !event ? "" : event.eventTime);

  const eventTimeValue = mode === "specific" ? formatTime12h(time) : customLabel;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {event ? (
        <div>
          <div className={labelClass}>Slug</div>
          <div className="text-[15px] text-[#7C93AA]">{event.id} (can&apos;t be changed)</div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="id">
            Slug (used in the URL, e.g. baptism-sunday)
          </label>
          <input id="id" name="id" className={inputClass} placeholder="baptism-sunday" />
          {state.fieldErrors?.id && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.id}</p>}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" defaultValue={event?.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.title}</p>}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <div>
          <label className={labelClass} htmlFor="eventDate">
            Start date
          </label>
          <input id="eventDate" name="eventDate" type="date" defaultValue={event?.eventDate} className={inputClass} />
          {state.fieldErrors?.eventDate && (
            <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.eventDate}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="dateLabel">
            Date label (optional — for multi-day events, e.g. &quot;August 14-16, 2026&quot;)
          </label>
          <input id="dateLabel" name="dateLabel" defaultValue={event?.dateLabel ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            Location (optional — defaults to the church address)
          </label>
          <input id="location" name="location" defaultValue={event?.location ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className={labelClass.replace("mb-1.5", "mb-0")}>Time</div>
          <div className="flex gap-1 rounded-full border border-[#DCE7F0] bg-white p-0.5">
            {(["specific", "custom"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="cursor-pointer rounded-full px-3 py-1 text-[12px]"
                style={{ background: mode === m ? "#2E90D9" : "transparent", color: mode === m ? "#FFFFFF" : "#4F6478" }}
              >
                {m === "specific" ? "Specific time" : "Custom label"}
              </button>
            ))}
          </div>
        </div>
        {mode === "specific" ? (
          <TimePicker value={time} onChange={setTime} />
        ) : (
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="e.g. All day, Evenings"
            className={inputClass}
          />
        )}
        <input type="hidden" name="eventTime" value={eventTimeValue} />
        {state.fieldErrors?.eventTime && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.eventTime}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={event?.description ?? ""}
          rows={6}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="image">
          Image {event?.imageUrl && "(leave empty to keep the current image)"}
        </label>
        <ImageFileInput id="image" name="image" existingImageUrl={event?.imageUrl} />
      </div>

      {state.error && <p className="text-[14px] text-[#C13B3B]">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : event ? "Save Changes" : "Create Event"}
      </button>
    </form>
  );
}
