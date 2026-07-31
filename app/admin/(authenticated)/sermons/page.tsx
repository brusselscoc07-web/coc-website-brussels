import { desc } from "drizzle-orm";
import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import Topbar from "@/components/admin/Topbar";
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
    <div>
      <Topbar
        title="Resources"
        subtitle="Sermons, Thought for the Week posts, and Bible Teachings studies all live here, distinguished by category."
      />
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-4">
          <Link
            href="/admin/sermons/new"
            className="cursor-pointer whitespace-nowrap rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline"
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
                  borderColor: active ? "#2E90D9" : "#DCE7F0",
                  background: active ? "#2E90D9" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#4F6478",
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
              className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#DCE7F0] bg-white p-4"
            >
              <div>
                <div className="text-[15px] font-semibold text-[#16233A]">{s.title}</div>
                <div className="text-[13px] text-[#7C93AA]">
                  {formatDate(s.date)} ·{" "}
                  <span className="rounded-full bg-[#F2F7FB] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#2E90D9]">
                    {s.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/sermons/${s.id}`} className="text-[13px] font-semibold text-[#2E90D9] no-underline">
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
            <div className="text-[14px] text-[#7C93AA]">
              {category === "All" ? "Nothing here yet." : `No ${category} entries yet.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
