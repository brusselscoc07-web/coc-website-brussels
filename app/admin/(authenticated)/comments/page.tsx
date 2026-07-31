import { desc, eq } from "drizzle-orm";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import Topbar from "@/components/admin/Topbar";
import { getDb } from "@/lib/db";
import { comments, sermons } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";
import { approveComment, rejectComment, revertToPending } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const db = await getDb();
  const rows = await db
    .select({
      id: comments.id,
      sermonId: comments.sermonId,
      sermonTitle: sermons.title,
      name: comments.name,
      text: comments.text,
      status: comments.status,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(sermons, eq(comments.sermonId, sermons.id))
    .orderBy(desc(comments.createdAt));

  const pending = rows.filter((r) => r.status === "pending");
  const reviewed = rows.filter((r) => r.status !== "pending").slice(0, 20);

  return (
    <div>
      <Topbar title="Comments" subtitle="Approve or reject visitor comments before they go live" />
      <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Pending ({pending.length})</div>
      <div className="mb-12 flex flex-col gap-3">
        {pending.map((c) => (
          <div key={c.id} className="rounded-2xl border border-[#DCE7F0] bg-white p-5">
            <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
              <span className="text-[14px] font-semibold text-[#16233A]">{c.name}</span>
              <span className="text-[12px] text-[#7C93AA]">{formatDate(c.createdAt)}</span>
              <span className="text-[12px] text-[#7C93AA]">on &ldquo;{c.sermonTitle}&rdquo;</span>
            </div>
            <div className="mb-3 text-[14px] leading-[1.6] text-[#1B1E2B]">{c.text}</div>
            <div className="flex gap-3">
              <form action={approveComment.bind(null, c.id, c.sermonId)}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#2E90D9] px-5 py-2 text-[13px] font-semibold text-white"
                >
                  Approve
                </button>
              </form>
              <form action={rejectComment.bind(null, c.id, c.sermonId)}>
                <ConfirmSubmitButton
                  confirmText="Reject this comment?"
                  className="cursor-pointer rounded-full border border-[#DCE7F0] px-5 py-2 text-[13px] font-semibold text-[#C13B3B]"
                >
                  Reject
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {pending.length === 0 && <div className="text-[14px] text-[#7C93AA]">No comments awaiting review.</div>}
      </div>

      <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Recently Reviewed</div>
      <div className="flex flex-col gap-3">
        {reviewed.map((c) => (
          <div key={c.id} className="rounded-2xl border border-[#DCE7F0] bg-[#F2F7FB] p-5">
            <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
              <span className="text-[14px] font-semibold text-[#16233A]">{c.name}</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[1px]"
                style={{ background: c.status === "approved" ? "#1F8A4C" : "#C13B3B", color: "#FFFFFF" }}
              >
                {c.status}
              </span>
              <span className="text-[12px] text-[#7C93AA]">on &ldquo;{c.sermonTitle}&rdquo;</span>
            </div>
            <div className="mb-3 text-[14px] leading-[1.6] text-[#1B1E2B]">{c.text}</div>
            <form action={revertToPending.bind(null, c.id, c.sermonId)}>
              <button type="submit" className="cursor-pointer text-[12px] font-semibold text-[#7C93AA]">
                Move back to pending
              </button>
            </form>
          </div>
        ))}
        {reviewed.length === 0 && <div className="text-[14px] text-[#7C93AA]">Nothing reviewed yet.</div>}
      </div>
      </div>
    </div>
  );
}
