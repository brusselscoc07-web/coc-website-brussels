"use client";

import { useActionState } from "react";
import { createAlbum, updateAlbum, type AlbumFormState } from "@/app/admin/(authenticated)/albums/actions";

type AlbumRow = { id: string; title: string; albumDate: string };

const initialState: AlbumFormState = {};

const inputClass = "w-full rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12px] tracking-[1px] text-gold uppercase";

export default function AlbumForm({ album }: { album?: AlbumRow }) {
  const action = album ? updateAlbum.bind(null, album.id) : createAlbum;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {album ? (
        <div>
          <div className={labelClass}>Slug</div>
          <div className="text-[15px] text-text-muted">{album.id} (can&apos;t be changed)</div>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="id">
            Slug (used in the URL, e.g. youth-retreat-2026)
          </label>
          <input id="id" name="id" className={inputClass} placeholder="youth-retreat-2026" />
          {state.fieldErrors?.id && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.id}</p>}
        </div>
      )}

      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input id="title" name="title" defaultValue={album?.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.title}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="albumDate">
          Date
        </label>
        <input id="albumDate" name="albumDate" type="date" defaultValue={album?.albumDate} className={inputClass} />
        {state.fieldErrors?.albumDate && (
          <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.albumDate}</p>
        )}
      </div>

      {state.error && <p className="text-[14px] text-live">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-full bg-green px-7 py-3 text-[14px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : album ? "Save Changes" : "Create Album"}
      </button>
    </form>
  );
}
