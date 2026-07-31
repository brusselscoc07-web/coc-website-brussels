import Link from "next/link";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import HeroSlideForm from "@/components/admin/HeroSlideForm";
import HomeHighlightsForm from "@/components/admin/HomeHighlightsForm";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { sermons as sermonsTable } from "@/lib/db/schema";
import { getHeroContent, getHomeHighlights } from "@/lib/settings";
import { deleteHeroSlide } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const { new: isNew, edit: editId } = await searchParams;
  const db = await getDb();
  const [hero, highlights, allSermons] = await Promise.all([
    getHeroContent(),
    getHomeHighlights(),
    db.select().from(sermonsTable),
  ]);
  const editing = editId ? hero.slides.find((s) => s.id === editId) : undefined;
  const formOpen = isNew === "1" || !!editing;

  return (
    <div>
      <Topbar title="Homepage Hero" subtitle="The rotating welcome banner and highlight cards on the homepage" />
      <div className="max-w-5xl px-6 py-8 md:px-9">
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[15px] font-semibold text-[#16233A]">Welcome Slides</div>
              {!formOpen && (
                <Link
                  href="/admin/hero?new=1"
                  className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline"
                >
                  + Add Slide
                </Link>
              )}
            </div>

            {formOpen ? (
              <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
                <div className="mb-4 text-[15px] font-semibold text-[#16233A]">
                  {editing ? "Edit Slide" : "New Slide"}
                </div>
                <HeroSlideForm slide={editing} onCancelHref="/admin/hero" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {hero.slides.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center gap-4 rounded-[14px] border border-[#DCE7F0] bg-white p-4"
                  >
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt=""
                        className="h-[90px] w-[150px] shrink-0 rounded-[10px] object-cover"
                      />
                    ) : (
                      <div className="flex h-[90px] w-[150px] shrink-0 items-center justify-center rounded-[10px] bg-[#EAF0F5] text-[12px] text-[#7C93AA]">
                        No image
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold text-[#16233A]">{s.headline}</div>
                      <div className="mt-0.5 text-[13px] text-[#7C93AA]">{s.sub}</div>
                    </div>
                    <Link href={`/admin/hero?edit=${s.id}`} className="text-[13px] text-[#2E90D9] no-underline">
                      Edit
                    </Link>
                    <form action={deleteHeroSlide.bind(null, s.id)}>
                      <ConfirmSubmitButton confirmText={`Delete "${s.headline}"?`}>Delete</ConfirmSubmitButton>
                    </form>
                  </div>
                ))}
                {hero.slides.length === 0 && <div className="text-[14px] text-[#7C93AA]">No hero slides yet.</div>}
              </div>
            )}
          </div>

          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
            <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Highlight Cards</div>
            <HomeHighlightsForm
              sermonOptions={allSermons.filter((s) => s.category === "Sermon")}
              thoughtOptions={allSermons.filter((s) => s.category === "Thought for the Week")}
              teachingOptions={allSermons.filter((s) => s.category === "Bible Teachings")}
              sermonId={highlights.sermonId}
              thoughtId={highlights.thoughtId}
              teachingId={highlights.teachingId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
