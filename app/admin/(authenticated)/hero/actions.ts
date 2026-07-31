"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getHeroContent, upsertSetting } from "@/lib/settings";
import { uploadFormImage } from "@/lib/upload";
import { heroSlideSchema } from "@/lib/validation/hero";

export type HeroSlideFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function str(value: FormDataEntryValue | null): string | undefined {
  return value === null ? undefined : String(value);
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export async function saveHeroSlide(
  slideId: string | null,
  _prevState: HeroSlideFormState,
  formData: FormData,
): Promise<HeroSlideFormState> {
  await requireAdminSession();
  const parsed = heroSlideSchema.safeParse({
    headline: str(formData.get("headline")),
    sub: str(formData.get("sub")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadFormImage(formData.get("image"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const current = await getHeroContent();
  const slides = current.slides.slice();
  if (slideId) {
    const idx = slides.findIndex((s) => s.id === slideId);
    if (idx === -1) return { error: "That slide no longer exists." };
    slides[idx] = {
      ...slides[idx],
      headline: parsed.data.headline,
      sub: parsed.data.sub || "",
      ...(imageUrl ? { imageUrl } : {}),
    };
  } else {
    slides.push({ id: crypto.randomUUID(), headline: parsed.data.headline, sub: parsed.data.sub || "", imageUrl });
  }

  await upsertSetting("hero", { slides });
  revalidatePath("/");
  redirect("/admin/hero");
}

export async function deleteHeroSlide(slideId: string) {
  await requireAdminSession();
  const current = await getHeroContent();
  const slides = current.slides.filter((s) => s.id !== slideId);
  await upsertSetting("hero", { slides });
  revalidatePath("/");
  redirect("/admin/hero");
}

// Picks exactly which Sermon / Thought for the Week / Bible Teachings entry
// fills each of the 3 homepage highlight cards below the hero, overriding the
// default "most recent in category" behavior. Empty string means "no manual
// pick" — stored as null so the homepage falls back to auto-selection.
export type HighlightsFormState = { error?: string };

export async function saveHomeHighlights(_prevState: HighlightsFormState, formData: FormData): Promise<HighlightsFormState> {
  await requireAdminSession();
  const sermonId = str(formData.get("sermonId"));
  const thoughtId = str(formData.get("thoughtId"));
  const teachingId = str(formData.get("teachingId"));

  await upsertSetting("homeHighlights", {
    sermonId: sermonId || null,
    thoughtId: thoughtId || null,
    teachingId: teachingId || null,
  });

  revalidatePath("/");
  redirect("/admin/hero");
}
