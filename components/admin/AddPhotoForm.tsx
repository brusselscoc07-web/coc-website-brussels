"use client";

import { useActionState } from "react";
import { addPhoto, type AlbumFormState } from "@/app/admin/(authenticated)/albums/actions";
import ImageFileInput from "./ImageFileInput";

const initialState: AlbumFormState = {};

const inputClass = "w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]";

export default function AddPhotoForm({ albumId }: { albumId: string }) {
  const [state, formAction, isPending] = useActionState(addPhoto.bind(null, albumId), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="min-w-0 flex-1">
        <ImageFileInput id="image" name="image" />
      </div>
      <div className="w-full lg:w-56">
        <input id="caption" name="caption" placeholder="Caption (optional)" className={inputClass} />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 cursor-pointer rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Add Photo"}
      </button>
      {state.error && <p className="w-full text-[13px] text-[#C13B3B]">{state.error}</p>}
    </form>
  );
}
