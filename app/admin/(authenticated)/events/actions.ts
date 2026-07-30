"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eventDateTimeFromISO } from "@/lib/timezone";
import { uploadFormImage } from "@/lib/upload";
import { eventSchema } from "@/lib/validation/event";

export type EventFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// FormData.get() returns null for an absent field, but Zod's .optional() only
// treats undefined as absent — a bare null fails a plain z.string() check.
function str(value: FormDataEntryValue | null): string | undefined {
  return value === null ? undefined : String(value);
}

function readFields(formData: FormData, id: string) {
  return eventSchema.safeParse({
    id,
    title: str(formData.get("title")),
    eventDate: str(formData.get("eventDate")),
    dateLabel: str(formData.get("dateLabel")),
    eventTime: str(formData.get("eventTime")),
    description: str(formData.get("description")),
    location: str(formData.get("location")),
  });
}

// A field can fail more than one rule — keep the first (more fundamental)
// message per field rather than letting a later, more specific one overwrite it.
function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export async function createEvent(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
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
  const [existing] = await db.select({ id: events.id }).from(events).where(eq(events.id, parsed.data.id));
  if (existing) {
    return { error: "That slug is already in use — pick a different one.", fieldErrors: { id: "Already in use" } };
  }

  const d = parsed.data;
  await db.insert(events).values({
    id: d.id,
    title: d.title,
    eventDate: d.eventDate,
    dateLabel: d.dateLabel || null,
    eventTime: d.eventTime,
    eventDateTime: eventDateTimeFromISO(d.eventDate, d.eventTime),
    description: d.description || null,
    location: d.location || null,
    imageUrl,
    createdBy: admin.adminUserId,
  });

  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
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
    .update(events)
    .set({
      title: d.title,
      eventDate: d.eventDate,
      dateLabel: d.dateLabel || null,
      eventTime: d.eventTime,
      eventDateTime: eventDateTimeFromISO(d.eventDate, d.eventTime),
      description: d.description || null,
      location: d.location || null,
      ...(imageUrl ? { imageUrl } : {}),
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  revalidatePath("/");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdminSession();
  const db = await getDb();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}
