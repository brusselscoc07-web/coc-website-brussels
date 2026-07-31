"use client";

import { useActionState } from "react";
import { createAlbum, updateAlbum, type AlbumFormState } from "@/app/admin/(authenticated)/albums/actions";

type AlbumRow = { id: string; title: string; albumDate: string };

const initialState: AlbumFormState = {};

const inputClass = "w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";

export default function AlbumForm({ album }: { album?: AlbumRow }) {
  const action = album ? updateAlbum.bind(null, album.id) : createAlbum;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {album ? (
        <div>
          <div className={labelClass}>Slug</div>
          <div className="text-[15px] text-[#7C93AA]">{album.id} (can&apos;t be changed)</div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="id">
            Slug (used in the URL, e.g. youth-retreat-2026)
          </label>
          <input id="id" name="id" className={inputClass} placeholder="youth-retreat-2026" />
          {state.fieldErrors?.id && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.id}</p>}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" defaultValue={album?.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.title}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="albumDate">
          Date
        </label>
        <input id="albumDate" name="albumDate" type="date" defaultValue={album?.albumDate} className={inputClass} />
        {state.fieldErrors?.albumDate && (
          <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.albumDate}</p>
        )}
      </div>

      {state.error && <p className="text-[14px] text-[#C13B3B]">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : album ? "Save Changes" : "Create Album"}
      </button>
    </form>
  );
}
