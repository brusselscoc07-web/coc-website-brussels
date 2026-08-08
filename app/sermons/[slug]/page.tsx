import { and, asc, eq, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SermonInteractive from "@/components/SermonInteractive";
import { getDb } from "@/lib/db";
import { comments as commentsTable, reactions as reactionsTable, sermons as sermonsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import type { ReactionCounts, ReactionKind } from "@/lib/reaction-kinds";
import { getVisitorId } from "@/lib/visitor";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const [sermon] = await db.select().from(sermonsTable).where(eq(sermonsTable.id, slug));
  return { title: sermon ? `${sermon.title} — Church of Christ Brussels` : "Sermon — Church of Christ Brussels" };
}

export default async function SermonDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ commented?: string }>;
}) {
  const { slug } = await params;
  const { commented } = await searchParams;
  const db = await getDb();
  const [sermon] = await db.select().from(sermonsTable).where(eq(sermonsTable.id, slug));
  if (!sermon) notFound();

  const approvedComments = await db
    .select()
    .from(commentsTable)
    .where(and(eq(commentsTable.sermonId, sermon.id), eq(commentsTable.status, "approved")))
    .orderBy(asc(commentsTable.createdAt));

  const reactionRows = await db
    .select({ kind: reactionsTable.kind, count: sql<number>`count(*)::int` })
    .from(reactionsTable)
    .where(eq(reactionsTable.sermonId, sermon.id))
    .groupBy(reactionsTable.kind);
  const initialReactions: ReactionCounts = { heart: 0, pray: 0, amen: 0 };
  for (const row of reactionRows) initialReactions[row.kind as ReactionKind] = row.count;

  const visitorId = await getVisitorId();
  let initialMyReaction: ReactionKind | null = null;
  if (visitorId) {
    const [mine] = await db
      .select()
      .from(reactionsTable)
      .where(and(eq(reactionsTable.sermonId, sermon.id), eq(reactionsTable.visitorId, visitorId)));
    initialMyReaction = (mine?.kind as ReactionKind) ?? null;
  }

  const videoUrl = sermon.videoUrl || "https://youtube.com";

  return (
    <div className="mx-auto max-w-[820px] px-8 py-20">
      <Link
        href="/sermons"
        className="inline-block cursor-pointer rounded-full bg-bg-alt px-5 py-2.5 text-[15px] font-semibold text-green no-underline"
      >
        ← All Posts
      </Link>
      <div className="mb-3 mt-5 font-serif text-[38px] font-bold text-green-dark">{sermon.title}</div>
      <div className="mb-7 flex flex-wrap gap-3.5 text-[13px] text-text-muted">
        <span>{formatDate(sermon.date)}</span>
        <span>·</span>
        <span>{sermon.preacher}</span>
        <span>·</span>
        <span>{sermon.scripture}</span>
      </div>

      {sermon.hasVideo && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="relative mb-8 block overflow-hidden rounded-2xl no-underline"
          style={{
            aspectRatio: "16/9",
            backgroundImage: `linear-gradient(180deg,rgba(10,12,10,0.15),rgba(10,12,10,0.6)),url(${sermon.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-4 right-4 top-4 flex items-center gap-2.5">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gold text-[15px] font-bold text-green-dark">
              C
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">{sermon.title}</div>
              <div className="text-[12px] text-bg-alt">Church of Christ Brussels</div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-11 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] bg-[#FF0000]">
            <span className="ml-1 inline-block border-y-[11px] border-l-[17px] border-y-transparent border-l-white" />
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px] text-white">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#FF0000" />
              <path d="M9.5 8.3l6.2 3.7-6.2 3.7z" fill="#fff" />
            </svg>
            Watch on YouTube
          </div>
        </a>
      )}

      <div className="mb-9 flex flex-col gap-[18px] text-[16px] leading-[1.85] text-ink-soft">
        {sermon.body.map((para, i) => (
          <p key={i} className="m-0">
            {para}
          </p>
        ))}
      </div>

      <SermonInteractive
        sermonId={sermon.id}
        sermonTitle={sermon.title}
        shareUrl={`/sermons/${sermon.id}`}
        justCommented={commented === "1"}
        comments={approvedComments.map((c) => ({ name: c.name, date: formatDate(c.createdAt), text: c.text }))}
        initialReactions={initialReactions}
        initialMyReaction={initialMyReaction}
      />
    </div>
  );
}
