"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { comments } from "@/lib/db/schema";

// Redirects rather than returning state — see app/sermons/[slug]/actions.ts
// for why a mutation on a page that also reads from the DB during render
// must not resolve via an in-place re-render with PGlite in local dev.
async function setStatus(id: string, status: "pending" | "approved" | "rejected", sermonId: string) {
  const admin = await requireAdminSession();
  const db = await getDb();
  await db
    .update(comments)
    .set({ status, reviewerId: admin.adminUserId, reviewedAt: new Date() })
    .where(eq(comments.id, id));
  revalidatePath(`/sermons/${sermonId}`);
  redirect("/admin/comments");
}

export async function approveComment(id: string, sermonId: string) {
  await setStatus(id, "approved", sermonId);
}

export async function rejectComment(id: string, sermonId: string) {
  await setStatus(id, "rejected", sermonId);
}

export async function revertToPending(id: string, sermonId: string) {
  await setStatus(id, "pending", sermonId);
}
