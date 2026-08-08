"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { comments, sermons } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { commentSchema } from "@/lib/validation/comment";

export type CommentFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "text", string>>;
};

const DEFAULT_NOTIFY_EMAIL = "office@cocbrussels.example";

function str(value: FormDataEntryValue | null): string | undefined {
  return value === null ? undefined : String(value);
}

// Redirects on success (Post/Redirect/Get) rather than returning state for an
// in-place re-render: this page's own render also queries the DB (sermon +
// approved comments), and a Server Action that writes then immediately
// triggers that same-request re-render reproducibly hung PGlite in local dev
// (confirmed via logging — the insert completes and the action returns, but
// the response never arrives). A redirect makes the next render a genuinely
// separate request, sidestepping the overlap — and is good practice
// regardless (refreshing the page doesn't resubmit the comment).
export async function submitComment(
  sermonId: string,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const allowed = await checkRateLimit("comment", { limit: 5, windowSeconds: 600 });
  if (!allowed) return { error: RATE_LIMIT_MESSAGE };

  const parsed = commentSchema.safeParse({
    name: str(formData.get("name")),
    email: str(formData.get("email")),
    text: str(formData.get("text")),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<CommentFormState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "text") fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const db = await getDb();
  const [sermon] = await db.select().from(sermons).where(eq(sermons.id, sermonId));

  await db.insert(comments).values({
    sermonId,
    name: parsed.data.name,
    email: parsed.data.email,
    text: parsed.data.text,
    status: "pending",
  });

  await sendEmail({
    to: env.CONTACT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL,
    replyTo: parsed.data.email,
    subject: `New comment/question on "${sermon?.title ?? sermonId}"`,
    text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nSermon: ${sermon?.title ?? sermonId}\n\n${parsed.data.text}`,
  });

  // No revalidatePath — this comment is pending moderation and shouldn't
  // appear publicly yet; the page will pick it up naturally once approved.
  redirect(`/sermons/${sermonId}?commented=1`);
}
