"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { upsertSetting, type SiteSetting } from "@/lib/settings";
import { siteSettingsSchema } from "@/lib/validation/site";

export type SiteSettingsFormState = {
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

export async function saveSiteSettings(data: SiteSetting): Promise<SiteSettingsFormState> {
  await requireAdminSession();
  const parsed = siteSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  await upsertSetting("site", parsed.data);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/join");
  return { success: true };
}
