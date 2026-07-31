"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { sermons } from "@/lib/db/schema";
import { savedRedirectPath } from "@/lib/toast";
import { uploadFormImage } from "@/lib/upload";
import { sermonSchema } from "@/lib/validation/sermon";

export type SermonFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// One textarea, paragraphs separated by a blank line, split into the DB's text[] column.
function parseBody(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// FormData.get() returns null for an absent field, but Zod's .optional() only
// treats undefined as absent — a bare null fails a plain z.string() check.
function str(value: FormDataEntryValue | null): string | undefined {
  return value === null ? undefined : String(value);
}

function readFields(formData: FormData, id: string) {
  return sermonSchema.safeParse({
    id,
    title: str(formData.get("title")),
    date: str(formData.get("date")),
    preacher: str(formData.get("preacher")),
    scripture: str(formData.get("scripture")),
    category: str(formData.get("category")),
    excerpt: str(formData.get("excerpt")),
    body: str(formData.get("body")),
    hasVideo: formData.get("hasVideo") === "on",
    videoUrl: str(formData.get("videoUrl")),
  });
}

// A field can fail more than one rule (e.g. an empty slug fails both "required"
// and the lowercase/hyphen format check) — keep the first message per field, not
// the last, since Zod reports the more fundamental check (required) before the
// more specific one (format), and overwriting with the last is misleading.
function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export async function createSermon(_prevState: SermonFormState, formData: FormData): Promise<SermonFormState> {
  const admin = await requireAdminSession();
  const parsed = readFields(formData, String(formData.get("id") ?? ""));
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadFormImage(formData.get("image"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const db = await getDb();
  const [existing] = await db.select({ id: sermons.id }).from(sermons).where(eq(sermons.id, parsed.data.id));
  if (existing) {
    return { error: "That slug is already in use — pick a different one.", fieldErrors: { id: "Already in use" } };
  }

  const d = parsed.data;
  await db.insert(sermons).values({
    id: d.id,
    title: d.title,
    date: d.date,
    preacher: d.preacher,
    scripture: d.scripture || null,
    category: d.category,
    excerpt: d.excerpt || null,
    body: parseBody(d.body),
    hasVideo: d.hasVideo ?? false,
    videoUrl: d.videoUrl || null,
    imageUrl,
    createdBy: admin.adminUserId,
  });

  revalidatePath("/sermons");
  revalidatePath("/");
  redirect(savedRedirectPath("/admin/sermons", "Resource created"));
}

// The slug is the primary key and comments/reactions cascade-delete off it, so
// it's fixed at creation — editing never changes `id`, avoiding silent data loss.
export async function updateSermon(
  id: string,
  _prevState: SermonFormState,
  formData: FormData,
): Promise<SermonFormState> {
  await requireAdminSession();
  const parsed = readFields(formData, id);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadFormImage(formData.get("image"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const db = await getDb();
  const d = parsed.data;
  await db
    .update(sermons)
    .set({
      title: d.title,
      date: d.date,
      preacher: d.preacher,
      scripture: d.scripture || null,
      category: d.category,
      excerpt: d.excerpt || null,
      body: parseBody(d.body),
      hasVideo: d.hasVideo ?? false,
      videoUrl: d.videoUrl || null,
      ...(imageUrl ? { imageUrl } : {}),
      updatedAt: new Date(),
    })
    .where(eq(sermons.id, id));

  revalidatePath("/sermons");
  revalidatePath(`/sermons/${id}`);
  revalidatePath("/");
  redirect(savedRedirectPath("/admin/sermons", "Resource updated"));
}

export async function deleteSermon(id: string) {
  await requireAdminSession();
  const db = await getDb();
  await db.delete(sermons).where(eq(sermons.id, id));
  revalidatePath("/sermons");
  revalidatePath("/");
  redirect(savedRedirectPath("/admin/sermons", "Resource deleted"));
}
