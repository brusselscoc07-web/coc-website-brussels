"use client";

import { useActionState } from "react";
import { saveHeroSlide, type HeroSlideFormState } from "@/app/admin/(authenticated)/hero/actions";
import type { HeroSlide } from "@/lib/settings";

const initialState: HeroSlideFormState = {};
const inputClass = "w-full rounded-[8px] border border-[#CBDBE8] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";

export default function HeroSlideForm({ slide, onCancelHref }: { slide?: HeroSlide; onCancelHref: string }) {
  const [state, formAction, isPending] = useActionState(saveHeroSlide.bind(null, slide?.id ?? null), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label className={labelClass} htmlFor="image">
          Slide image {slide?.imageUrl && "(leave empty to keep the current image)"}
        </label>
        {slide?.imageUrl && (
          <img src={slide.imageUrl} alt="" className="mb-2.5 h-[170px] w-full max-w-[320px] rounded-[10px] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} />
        <p className="mt-1.5 text-[12px] text-[#7C93AA]">No image? A decorative gradient is used instead.</p>
      </div>

      <div>
        <label className={labelClass} htmlFor="headline">
          Headline
        </label>
        <input id="headline" name="headline" defaultValue={slide?.headline} className={inputClass} />
        {state.fieldErrors?.headline && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.headline}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="sub">
          Subtext
        </label>
        <input id="sub" name="sub" defaultValue={slide?.sub} className={inputClass} />
      </div>

      {state.error && <p className="text-[14px] text-[#C13B3B]">{state.error}</p>}

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save Slide"}
        </button>
        <a
          href={onCancelHref}
          className="cursor-pointer rounded-[10px] bg-[#EAF0F5] px-6 py-3 text-[13.5px] text-[#4F6478] no-underline"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
