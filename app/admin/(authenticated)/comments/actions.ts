"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getDb } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { savedRedirectPath } from "@/lib/toast";

const STATUS_MESSAGE: Record<string, string> = {
  approved: "Comment published",
  read: "Marked as read",
  pending: "Moved back to pending",
};

// Redirects rather than returning state — see app/sermons/[slug]/actions.ts
// for why a mutation on a page that also reads from the DB during render
// must not resolve via an in-place re-render with PGlite in local dev.
async function setStatus(id: string, status: "pending" | "approved" | "read", sermonId: string) {
  const admin = await requireAdminSession();
  const db = await getDb();
  await db
    .update(comments)
    .set({ status, reviewerId: admin.adminUserId, reviewedAt: new Date() })
    .where(eq(comments.id, id));
  revalidatePath(`/sermons/${sermonId}`);
  redirect(savedRedirectPath("/admin/comments", STATUS_MESSAGE[status]));
}

export async function publishComment(id: string, sermonId: string) {
  await setStatus(id, "approved", sermonId);
}

export async function markCommentAsRead(id: string, sermonId: string) {
  await setStatus(id, "read", sermonId);
}

export async function revertToPending(id: string, sermonId: string) {
  await setStatus(id, "pending", sermonId);
}
