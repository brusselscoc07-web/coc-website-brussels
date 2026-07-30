import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { events, sermons } from "@/lib/db/schema";
import type { SearchItem } from "@/lib/data";

const STATIC_PAGES: SearchItem[] = [
  { type: "Pages", title: "About Us", snippet: "Our statement of faith and church leadership.", href: "/about" },
  { type: "Pages", title: "Join Us", snippet: "What our worship consists of and how to visit.", href: "/join" },
  { type: "Pages", title: "Contact", snippet: "Reach out, visit, or call the church office.", href: "/contact" },
];

// Content volume here is tiny (dozens of rows, not thousands), so a real
// search engine would be overkill — this just needs to reflect admin edits
// without every page load hitting the DB. Client fetches this once when
// search opens (see SiteHeader.tsx), and the browser's own HTTP cache
// (Cache-Control below) keeps repeat opens cheap without re-querying.
//
// Deliberately NOT using the `revalidate` export here: that makes Next
// statically prerender this route at build time, and route handlers that
// touch the DB during build hit the same PGlite crash as static pages did
// (see app/page.tsx) — force-dynamic skips that build-time execution entirely.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  // Sequential, not Promise.all — PGlite is a single WASM instance not
  // designed for overlapping queries (see app/sermons/[slug]/actions.ts for
  // the concurrent-query hang this project already hit once).
  const allSermons = await db.select({ id: sermons.id, title: sermons.title, excerpt: sermons.excerpt }).from(sermons);
  const allEvents = await db
    .select({ id: events.id, title: events.title, description: events.description })
    .from(events);

  const index: SearchItem[] = [
    ...allSermons.map((s) => ({ type: "Blog" as const, title: s.title, snippet: s.excerpt ?? "", href: `/sermons/${s.id}` })),
    ...allEvents.map((e) => ({
      type: "Events" as const,
      title: e.title,
      snippet: e.description ?? "",
      href: `/events/${e.id}`,
    })),
    ...STATIC_PAGES,
  ];

  return NextResponse.json(index, { headers: { "Cache-Control": "public, max-age=300" } });
}
