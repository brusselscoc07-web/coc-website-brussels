"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { changePasswordSchema, profileSchema } from "@/lib/validation/profile";

export type ProfileFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
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

export async function updateProfile(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const admin = await requireAdminSession();
  const parsed = profileSchema.safeParse({
    name: str(formData.get("name")),
    email: str(formData.get("email")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const db = await getDb();
  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email));
  if (existing && existing.id !== admin.adminUserId) {
    return { error: "That email is already in use.", fieldErrors: { email: "Already in use" } };
  }

  await db.update(adminUsers).set({ name: parsed.data.name, email }).where(eq(adminUsers.id, admin.adminUserId));

  const session = await getSession();
  session.adminEmail = email;
  await session.save();

  revalidatePath("/admin");
  return { success: true };
}

export async function changePassword(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const admin = await requireAdminSession();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: str(formData.get("currentPassword")),
    newPassword: str(formData.get("newPassword")),
    confirmPassword: str(formData.get("confirmPassword")),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const db = await getDb();
  const [user] = await db
    .select({ passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.id, admin.adminUserId));
  if (!user) return { error: "Account not found." };

  const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { error: "Current password is incorrect.", fieldErrors: { currentPassword: "Incorrect password" } };

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, admin.adminUserId));

  return { success: true };
}
