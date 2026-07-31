"use server";

import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { savedRedirectPath } from "@/lib/toast";

export async function setLivestreamStatus(isLive: boolean) {
  const admin = await requireAdminSession();
  const db = await getDb();
  const value = { isLive, toggledBy: admin.adminUserId, toggledAt: new Date().toISOString() };

  await db
    .insert(settings)
    .values({ key: "livestream", value })
    .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: sql`now()` } });

  revalidatePath("/");
  redirect(savedRedirectPath("/admin/livestream", isLive ? "You're live" : "Livestream ended"));
}
