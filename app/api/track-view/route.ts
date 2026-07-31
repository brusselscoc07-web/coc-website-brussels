import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";

// Fire-and-forget page view beacon, called by components/PageViewTracker.tsx
// on every public-page navigation. Loosely rate limited per IP just to blunt
// abuse (e.g. a script hammering this endpoint to inflate the dashboard
// count) — normal browsing never gets close to this ceiling.
export async function POST(request: Request) {
  const allowed = await checkRateLimit("track-view", { limit: 120, windowSeconds: 60 });
  if (!allowed) return NextResponse.json({ ok: false }, { status: 429 });

  let path = "/";
  try {
    const body = await request.json();
    if (typeof body?.path === "string") path = body.path.slice(0, 300);
  } catch {
    // Malformed body — still record a hit under the default path.
  }

  const db = await getDb();
  await db.insert(pageViews).values({ path });

  return NextResponse.json({ ok: true });
}
