"use client";

import { useRef, useState } from "react";
import type { Comment } from "@/lib/data";

type ReactionKind = "heart" | "pray" | "amen";

export default function SermonInteractive({
  shareUrl,
  comments,
}: {
  shareUrl: string;
  comments: Comment[];
}) {
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [copyButtonState, setCopyButtonState] = useState<"idle" | "copied">("idle");
  const [reactions, setReactions] = useState({ heart: 24, pray: 15, amen: 31 });
  const [myReaction, setMyReaction] = useState<ReactionKind | null>(null);
  const [commentDraft, setCommentDraft] = useState({ name: "", email: "", text: "" });
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  function react(kind: ReactionKind) {
    setReactions((cur) => {
      const next = { ...cur };
      if (myReaction === kind) {
        next[kind] -= 1;
        return next;
      }
      if (myReaction) next[myReaction] -= 1;
      next[kind] += 1;
      return next;
    });
    setMyReaction((cur) => (cur === kind ? null : kind));
  }

  function copyLink() {
    // clipboard may be unavailable or denied — modal still shows the link to copy manually
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopyModalOpen(true);
    setCopyButtonState("copied");
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyButtonState("idle"), 1800);
  }

  function submitComment() {
    if (!commentDraft.name || !commentDraft.text) return;
    setCommentSubmitted(true);
    setCommentDraft({ name: "", email: "", text: "" });
  }

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          onClick={copyLink}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-text"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 14a3.5 3.5 0 000 5l.5.5a3.5 3.5 0 005-5l-1-1"
              stroke="#4A4438"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M14 10a3.5 3.5 0 000-5l-.5-.5a3.5 3.5 0 00-5 5l1 1"
              stroke="#4A4438"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Copy link
        </button>
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-text no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#1877F2" />
            <path
              d="M14.7 8.4h-1.3c-.5 0-.6.2-.6.6v1.3h1.9l-.25 2h-1.65v6h-2.3v-6H9v-2h1.55V8.9c0-1.7.9-2.7 2.6-2.7h1.55z"
              fill="#fff"
            />
          </svg>
          Share to Facebook
        </a>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-text no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#25D366" />
            <path
              d="M12 6.5a5.5 5.5 0 00-4.7 8.4l-.8 2.6 2.7-.8A5.5 5.5 0 1012 6.5z"
              fill="none"
              stroke="#fff"
              strokeWidth="1.3"
            />
          </svg>
          Share to WhatsApp
        </a>
      </div>

      {copyModalOpen && (
        <div
          onClick={() => setCopyModalOpen(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(20,22,18,0.55)] p-5 backdrop-blur-[3px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(440px,92vw)] rounded-[20px] bg-white p-7 shadow-[0_30px_80px_rgba(20,22,18,0.35)]"
          >
            <div className="mb-1.5 font-serif text-[22px] font-bold text-green-dark">Copy link</div>
            <div className="mb-4 text-[13px] text-text-muted">Copy this link to share the video wherever you like.</div>
            <div className="flex gap-2">
              <input
                ref={linkInputRef}
                readOnly
                value={shareUrl}
                onClick={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-bg px-3.5 py-3 font-sans text-[13.5px] text-ink-soft"
              />
              <button
                onClick={copyLink}
                className="shrink-0 cursor-pointer rounded-[10px] bg-green px-5 py-3 text-[13.5px] font-semibold text-bg"
              >
                {copyButtonState === "copied" ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <button onClick={() => setCopyModalOpen(false)} className="mt-4.5 mt-[18px] cursor-pointer text-[13px] text-text-muted">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mb-12 flex flex-wrap gap-3 border-y border-border py-5">
        <button
          onClick={() => react("heart")}
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[14px]"
          style={{ background: myReaction === "heart" ? "#E7D2A0" : "#F1E9D8" }}
        >
          ❤️ <span>{reactions.heart}</span>
        </button>
        <button
          onClick={() => react("pray")}
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[14px]"
          style={{ background: myReaction === "pray" ? "#E7D2A0" : "#F1E9D8" }}
        >
          🙏 <span>{reactions.pray}</span>
        </button>
        <button
          onClick={() => react("amen")}
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[14px]"
          style={{ background: myReaction === "amen" ? "#E7D2A0" : "#F1E9D8" }}
        >
          🙌 Amen <span>{reactions.amen}</span>
        </button>
      </div>

      <div className="mb-5 font-serif text-[24px] font-bold text-green-dark">Comments</div>
      {commentSubmitted && (
        <div className="mb-5 rounded-xl bg-bg-alt px-5 py-4 text-[14px] text-text">
          Thanks — your comment has been submitted and is awaiting approval before it appears publicly.
        </div>
      )}
      <div className="mb-7 flex flex-col gap-2.5">
        <input
          placeholder="Your name"
          value={commentDraft.name}
          onChange={(e) => setCommentDraft((c) => ({ ...c, name: e.target.value }))}
          className="rounded-[10px] border border-border px-4 py-3 font-sans text-[14px]"
        />
        <input
          placeholder="Email (optional, not published)"
          value={commentDraft.email}
          onChange={(e) => setCommentDraft((c) => ({ ...c, email: e.target.value }))}
          className="rounded-[10px] border border-border px-4 py-3 font-sans text-[14px]"
        />
        <textarea
          placeholder="Write a comment..."
          value={commentDraft.text}
          onChange={(e) => setCommentDraft((c) => ({ ...c, text: e.target.value }))}
          rows={3}
          className="resize-y rounded-[10px] border border-border px-4 py-3 font-sans text-[14px]"
        />
        <button
          onClick={submitComment}
          className="cursor-pointer self-start rounded-full bg-green px-[22px] py-2.5 text-[14px] text-bg"
        >
          Post Comment
        </button>
      </div>
      <div className="flex flex-col gap-5">
        {comments.map((cm, i) => (
          <div key={i} className="border-t border-border pt-4">
            <div className="mb-1.5 flex items-baseline gap-2.5">
              <span className="text-[14px] font-semibold text-green-dark">{cm.name}</span>
              <span className="text-[12px] text-text-muted">{cm.date}</span>
            </div>
            <div className="text-[14px] leading-[1.7] text-text">{cm.text}</div>
          </div>
        ))}
      </div>
    </>
  );
}
