"use client";

import { useState } from "react";

export default function CommentPreview({
  name,
  email,
  sermonTitle,
  text,
  date,
}: {
  name: string;
  email: string | null;
  sermonTitle: string;
  text: string;
  date: string;
}) {
  const [open, setOpen] = useState(false);
  const preview = text.length > 140 ? `${text.slice(0, 140)}…` : text;

  return (
    <>
      <div className="mb-3 text-[14px] leading-[1.6] text-[#1B1E2B]">{preview}</div>
      {text.length > 140 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-3 cursor-pointer text-[12.5px] font-semibold text-[#2E90D9]"
        >
          View full message
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[rgba(20,22,18,0.55)] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(560px,92vw)] max-h-[80vh] overflow-y-auto rounded-[16px] bg-white p-7 shadow-[0_30px_80px_rgba(20,22,18,0.35)]"
          >
            <div className="mb-1 text-[16px] font-bold text-[#16233A]">{name}</div>
            {email && <div className="mb-1 text-[13px] text-[#7C93AA]">{email}</div>}
            <div className="mb-4 text-[12px] text-[#7C93AA]">
              on &ldquo;{sermonTitle}&rdquo; · {date}
            </div>
            <div className="mb-5 text-[14px] leading-[1.7] text-[#1B1E2B]">{text}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
