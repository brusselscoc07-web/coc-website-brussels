import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { categories, ctaLabel, type Sermon, typeColor } from "@/lib/data";
import { getDb } from "@/lib/db";
import { sermons as sermonsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Resources — Church of Christ Brussels",
};

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category = categories.includes(rawCategory as (typeof categories)[number]) ? rawCategory! : "All";

  const db = await getDb();
  const allSermons = await db.select().from(sermonsTable).orderBy(desc(sermonsTable.date));
  const filtered = category === "All" ? allSermons : allSermons.filter((s) => s.category === category);

  return (
    <div className="mx-auto max-w-6xl px-8 py-20">
      <div className="mb-5 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Teaching</div>
        <div className="font-serif text-[42px] font-bold text-green-dark">Resources</div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2.5">
        {categories.map((c) => {
          const active = category === c;
          return (
            <Link
              key={c}
              href={c === "All" ? "/sermons" : `/sermons?category=${encodeURIComponent(c)}`}
              className="cursor-pointer rounded-full border px-[18px] py-2 text-[13px] no-underline"
              style={{
                borderColor: active ? "#2C4A3D" : "#E7DFCE",
                background: active ? "#2C4A3D" : "#FFFFFF",
                color: active ? "#FAF5EA" : "#4A4438",
              }}
            >
              {c}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7">
        {filtered.map((sm) => {
          const category = sm.category as Sermon["category"];
          const isThought = category === "Thought for the Week";
          const color = typeColor(category);
          return (
            <Link
              key={sm.id}
              href={`/sermons/${sm.id}`}
              className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-white no-underline"
            >
              {!isThought && (
                <div
                  className="relative h-[160px]"
                  style={{ backgroundImage: `url(${sm.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  <span
                    className="absolute left-3.5 top-3.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold tracking-[1.5px] text-bg uppercase"
                    style={{ background: color }}
                  >
                    {sm.category}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-[22px]">
                {isThought && (
                  <div className="mb-2.5 text-[15px] font-bold tracking-[1px] text-gold uppercase">
                    Thought for the Week
                  </div>
                )}
                <div className="mb-2 font-serif text-[20px] font-bold text-green-dark">{sm.title}</div>
                <div className="mb-2.5 text-[12px] text-text-muted">
                  {formatDate(sm.date)} · {sm.scripture}
                </div>
                <div className="mb-4 text-[13.5px] leading-[1.6] text-text">{sm.excerpt}</div>
                <div className="mt-auto text-[13px] font-semibold" style={{ color }}>
                  {ctaLabel(category)} →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
