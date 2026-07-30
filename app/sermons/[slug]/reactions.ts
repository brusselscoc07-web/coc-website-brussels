"use server";

import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { reactions } from "@/lib/db/schema";
import { REACTION_KINDS, type ReactionCounts, type ReactionKind } from "@/lib/reaction-kinds";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureVisitorId } from "@/lib/visitor";

// Called directly from a client onClick handler — not wired through a
// <form>/useActionState — so there's no implicit same-request re-render of
// the sermon page afterward (which also reads from the DB during its own
// render; see app/sermons/[slug]/actions.ts for why that combination hung
// PGlite in local dev). The client applies the returned counts itself.
export async function toggleReaction(
  sermonId: string,
  kind: ReactionKind,
): Promise<{ counts: ReactionCounts; myReaction: ReactionKind | null }> {
  if (!REACTION_KINDS.includes(kind)) throw new Error("Invalid reaction kind");

  // Generous limit — legitimately switching between heart/pray/amen a few
  // times is normal, this only blocks a scripted spam loop.
  const allowed = await checkRateLimit("reaction", { limit: 20, windowSeconds: 60 });
  if (!allowed) throw new Error("Too many requests — please slow down.");

  const visitorId = await ensureVisitorId();
  const db = await getDb();

  const [existing] = await db
    .select()
    .from(reactions)
    .where(and(eq(reactions.sermonId, sermonId), eq(reactions.visitorId, visitorId)));

  let myReaction: ReactionKind | null;
  if (existing && existing.kind === kind) {
    await db.delete(reactions).where(eq(reactions.id, existing.id));
    myReaction = null;
  } else if (existing) {
    await db.update(reactions).set({ kind }).where(eq(reactions.id, existing.id));
    myReaction = kind;
  } else {
    await db.insert(reactions).values({ sermonId, visitorId, kind });
    myReaction = kind;
  }

  const rows = await db
    .select({ kind: reactions.kind, count: sql<number>`count(*)::int` })
    .from(reactions)
    .where(eq(reactions.sermonId, sermonId))
    .groupBy(reactions.kind);

  const counts: ReactionCounts = { heart: 0, pray: 0, amen: 0 };
  for (const row of rows) counts[row.kind as ReactionKind] = row.count;

  return { counts, myReaction };
}
