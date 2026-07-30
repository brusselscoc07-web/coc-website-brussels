"use client";

import { useActionState } from "react";
import { createEvent, updateEvent, type EventFormState } from "@/app/admin/(authenticated)/events/actions";

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

const inputClass = "w-full rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12px] tracking-[1px] text-gold uppercase";

export default function EventForm({ event }: { event?: EventRow }) {
  const action = event ? updateEvent.bind(null, event.id) : createEvent;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {event ? (
        <div>
          <div className={labelClass}>Slug</div>
          <div className="text-[15px] text-text-muted">{event.id} (can&apos;t be changed)</div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="id">
            Slug (used in the URL, e.g. baptism-sunday)
          </label>
          <input id="id" name="id" className={inputClass} placeholder="baptism-sunday" />
          {state.fieldErrors?.id && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.id}</p>}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" defaultValue={event?.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.title}</p>}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <div>
          <label className={labelClass} htmlFor="eventDate">
            Start date
          </label>
          <input id="eventDate" name="eventDate" type="date" defaultValue={event?.eventDate} className={inputClass} />
          {state.fieldErrors?.eventDate && (
            <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.eventDate}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="dateLabel">
            Date label (optional — for multi-day events, e.g. &quot;August 14-16, 2026&quot;)
          </label>
          <input id="dateLabel" name="dateLabel" defaultValue={event?.dateLabel ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="eventTime">
            Time (e.g. &quot;12:30 PM&quot; or &quot;All day&quot;)
          </label>
          <input id="eventTime" name="eventTime" defaultValue={event?.eventTime} className={inputClass} />
          {state.fieldErrors?.eventTime && (
            <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.eventTime}</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="location">
            Location (optional — defaults to the church address)
          </label>
          <input id="location" name="location" defaultValue={event?.location ?? ""} className={inputClass} />
        </div>
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
        {event?.imageUrl && (
          <img src={event.imageUrl} alt="" className="mb-2.5 h-32 w-52 rounded-[10px] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} />
      </div>

      {state.error && <p className="text-[14px] text-live">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-full bg-green px-7 py-3 text-[14px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : event ? "Save Changes" : "Create Event"}
      </button>
    </form>
  );
}
