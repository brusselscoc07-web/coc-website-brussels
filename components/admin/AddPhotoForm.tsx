"use client";

import { useActionState } from "react";
import { addPhoto, type AlbumFormState } from "@/app/admin/(authenticated)/albums/actions";

const initialState: AlbumFormState = {};

const inputClass = "w-full rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]";

export default function AddPhotoForm({ albumId }: { albumId: string }) {
  const [state, formAction, isPending] = useActionState(addPhoto.bind(null, albumId), initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} />
      </div>
      <div className="min-w-[200px] flex-1">
        <input id="caption" name="caption" placeholder="Caption (optional)" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-full bg-green px-6 py-3 text-[14px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Add Photo"}
      </button>
      {state.error && <p className="w-full text-[13px] text-live">{state.error}</p>}
    </form>
  );
}
