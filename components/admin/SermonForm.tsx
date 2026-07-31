"use client";

import { useActionState } from "react";
import { SERMON_CATEGORIES } from "@/lib/validation/sermon";
import { createSermon, updateSermon, type SermonFormState } from "@/app/admin/(authenticated)/sermons/actions";

type SermonRow = {
  id: string;
  title: string;
  date: string;
  preacher: string;
  scripture: string | null;
  category: string;
  excerpt: string | null;
  body: string[];
  hasVideo: boolean;
  videoUrl: string | null;
  imageUrl: string | null;
};

const initialState: SermonFormState = {};

const inputClass = "w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";

export default function SermonForm({ sermon }: { sermon?: SermonRow }) {
  const action = sermon ? updateSermon.bind(null, sermon.id) : createSermon;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {sermon ? (
        <div>
          <div className={labelClass}>Slug</div>
          <div className="text-[15px] text-[#7C93AA]">{sermon.id} (can&apos;t be changed)</div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="id">
            Slug (used in the URL, e.g. walking-by-faith)
          </label>
          <input id="id" name="id" className={inputClass} placeholder="walking-by-faith" />
          {state.fieldErrors?.id && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.id}</p>}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" defaultValue={sermon?.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.title}</p>}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        <div>
          <label className={labelClass} htmlFor="date">
            Date
          </label>
          <input id="date" name="date" type="date" defaultValue={sermon?.date} className={inputClass} />
          {state.fieldErrors?.date && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.date}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="preacher">
            Preacher
          </label>
          <input id="preacher" name="preacher" defaultValue={sermon?.preacher} className={inputClass} />
          {state.fieldErrors?.preacher && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.preacher}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="scripture">
            Scripture
          </label>
          <input id="scripture" name="scripture" defaultValue={sermon?.scripture ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Category
          </label>
          <select id="category" name="category" defaultValue={sermon?.category ?? SERMON_CATEGORIES[0]} className={inputClass}>
            {SERMON_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">
          Excerpt (short summary shown in listings)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={sermon?.excerpt ?? ""}
          rows={2}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="body">
          Body (separate paragraphs with a blank line)
        </label>
        <textarea
          id="body"
          name="body"
          defaultValue={sermon?.body.join("\n\n") ?? ""}
          rows={10}
          className={`${inputClass} resize-y`}
        />
        {state.fieldErrors?.body && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.body}</p>}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <div>
          <label className={labelClass} htmlFor="videoUrl">
            Video URL (optional)
          </label>
          <input id="videoUrl" name="videoUrl" defaultValue={sermon?.videoUrl ?? ""} className={inputClass} />
        </div>
        <label className="mt-6 flex items-center gap-2.5 text-[14px] text-[#1B1E2B]">
          <input type="checkbox" name="hasVideo" defaultChecked={sermon?.hasVideo} className="h-4 w-4" />
          Has a video recording
        </label>
      </div>

      <div>
        <label className={labelClass} htmlFor="image">
          Image {sermon?.imageUrl && "(leave empty to keep the current image)"}
        </label>
        {sermon?.imageUrl && (
          <img src={sermon.imageUrl} alt="" className="mb-2.5 h-32 w-52 rounded-[10px] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} />
      </div>

      {state.error && <p className="text-[14px] text-[#C13B3B]">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : sermon ? "Save Changes" : "Create Resource"}
      </button>
    </form>
  );
}
