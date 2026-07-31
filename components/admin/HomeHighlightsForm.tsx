"use client";

import { useActionState } from "react";
import { saveHomeHighlights } from "@/app/admin/(authenticated)/hero/actions";
import type { HighlightsFormState } from "@/app/admin/(authenticated)/hero/actions";

type SermonOption = { id: string; title: string };

const selectClass = "w-full rounded-[8px] border border-[#CBDBE8] bg-white px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";
const initialState: HighlightsFormState = {};

export default function HomeHighlightsForm({
  sermonOptions,
  thoughtOptions,
  teachingOptions,
  sermonId,
  thoughtId,
  teachingId,
}: {
  sermonOptions: SermonOption[];
  thoughtOptions: SermonOption[];
  teachingOptions: SermonOption[];
  sermonId: string | null;
  thoughtId: string | null;
  teachingId: string | null;
}) {
  const [state, formAction, isPending] = useActionState(saveHomeHighlights, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <p className="text-[13px] leading-[1.6] text-[#7C93AA]">
        Pick exactly which entry fills each of the 3 cards shown on the homepage, below the hero banner. Leave a slot
        on &ldquo;Most recent&rdquo; to keep the automatic behavior — always showing the latest entry in that
        category.
      </p>

      <div>
        <label className={labelClass} htmlFor="sermonId">
          Latest Sermon card
        </label>
        <select id="sermonId" name="sermonId" defaultValue={sermonId ?? ""} className={selectClass}>
          <option value="">Most recent (automatic)</option>
          {sermonOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="thoughtId">
          Thought For The Week card
        </label>
        <select id="thoughtId" name="thoughtId" defaultValue={thoughtId ?? ""} className={selectClass}>
          <option value="">Most recent (automatic)</option>
          {thoughtOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="teachingId">
          Bible Teachings card
        </label>
        <select id="teachingId" name="teachingId" defaultValue={teachingId ?? ""} className={selectClass}>
          <option value="">Most recent (automatic)</option>
          {teachingOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {state.error && <p className="text-[14px] text-[#C13B3B]">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
