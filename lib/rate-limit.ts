import { createHash } from "node:crypto";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "./db";
import { rateLimitHits } from "./db/schema";
import { env } from "./env";

async function getClientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${ip}:${env.SESSION_SECRET}`).digest("hex").slice(0, 32);
}

// Sliding-window rate limit backed by the same DB — no separate Redis/Upstash
// vendor needed (see plan notes). Returns true when the request is allowed
// (and records it); false when the caller should be rejected.
export async function checkRateLimit(action: string, opts: { limit: number; windowSeconds: number }): Promise<boolean> {
  const ipHash = await getClientIpHash();
  const bucketKey = `${action}:${ipHash}`;
  const db = await getDb();
  const windowStart = new Date(Date.now() - opts.windowSeconds * 1000);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rateLimitHits)
    .where(and(eq(rateLimitHits.bucketKey, bucketKey), gte(rateLimitHits.createdAt, windowStart)));

  if (count >= opts.limit) return false;

  await db.insert(rateLimitHits).values({ bucketKey });
  // Opportunistic cleanup so this table doesn't grow unbounded — cheap at this
  // traffic scale, no separate cron job needed.
  await db.delete(rateLimitHits).where(lt(rateLimitHits.createdAt, new Date(Date.now() - 60 * 60 * 1000)));

  return true;
}

export const RATE_LIMIT_MESSAGE = "Too many requests — please try again in a few minutes.";
