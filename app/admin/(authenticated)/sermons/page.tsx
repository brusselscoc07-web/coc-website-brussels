import { desc } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { categories } from "@/lib/data";
import { getDb } from "@/lib/db";
import { sermons as sermonsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { deleteSermon } from "./actions";

export const dynamic = "force-dynamic";

// Sermons, "Thought for the Week" posts, and "Bible Teachings" studies are all
// rows in the same sermons table, distinguished only by the category field
// (see the dropdown in components/admin/SermonForm.tsx) — this page manages
// all three, filterable by category, not just "sermons" in the narrow sense.
export default async function AdminSermonsPage({
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
    <div className="mx-auto max-w-4xl px-8 py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-serif text-[32px] font-bold text-green-dark">Resources</div>
          <p className="mt-1 text-[13px] text-text-muted">
            Sermons, Thought for the Week posts, and Bible Teachings studies all live here, distinguished by category.
          </p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="cursor-pointer whitespace-nowrap rounded-full bg-green px-6 py-3 text-[14px] font-semibold text-bg no-underline"
        >
          + New Resource
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        {categories.map((c) => {
          const active = category === c;
          return (
            <Link
              key={c}
              href={c === "All" ? "/admin/sermons" : `/admin/sermons?category=${encodeURIComponent(c)}`}
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

      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5"
          >
            <div>
              <div className="font-serif text-[18px] font-bold text-green-dark">{s.title}</div>
              <div className="text-[13px] text-text-muted">
                {formatDate(s.date)} ·{" "}
                <span className="rounded-full bg-bg-alt px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-green">
                  {s.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/sermons/${s.id}`} className="text-[13px] font-semibold text-green no-underline">
                Edit
              </Link>
              <form action={deleteSermon.bind(null, s.id)}>
                <ConfirmSubmitButton confirmText={`Delete "${s.title}"? This can't be undone.`}>
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-[14px] text-text-muted">
            {category === "All" ? "Nothing here yet." : `No ${category} entries yet.`}
          </div>
        )}
      </div>
    </div>
  );
}
