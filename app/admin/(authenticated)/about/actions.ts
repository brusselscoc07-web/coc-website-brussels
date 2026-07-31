"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { upsertSetting, type AboutSetting } from "@/lib/settings";
import { aboutSchema } from "@/lib/validation/about";

export type AboutFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0]);
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

export async function saveAbout(data: AboutSetting): Promise<AboutFormState> {
  await requireAdminSession();
  const parsed = aboutSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  await upsertSetting("about", parsed.data);
  revalidatePath("/about");
  return { success: true };
}
