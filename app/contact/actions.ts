"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation/contact";

export type ContactFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const DEFAULT_NOTIFY_EMAIL = "office@cocbrussels.example";

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const allowed = await checkRateLimit("contact", { limit: 5, windowSeconds: 600 });
  if (!allowed) return { success: false, error: RATE_LIMIT_MESSAGE };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<ContactFormState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please fix the errors below.", fieldErrors };
  }

  const { name, email, message } = parsed.data;
  const db = await getDb();

  const [row] = await db
    .insert(contactSubmissions)
    .values({ name, email, message })
    .returning({ id: contactSubmissions.id });

  const { sent } = await sendEmail({
    to: env.CONTACT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  if (sent) {
    await db.update(contactSubmissions).set({ emailSent: true }).where(eq(contactSubmissions.id, row.id));
  }

  return { success: true };
}
