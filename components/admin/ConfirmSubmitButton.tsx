"use client";

import { useRef, useState, type ReactNode } from "react";

export default function ConfirmSubmitButton({
  children,
  confirmText,
  className,
}: {
  children: ReactNode;
  confirmText: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function confirm() {
    setOpen(false);
    btnRef.current?.closest("form")?.requestSubmit();
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? "cursor-pointer text-[13px] font-semibold text-[#C13B3B]"}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(22,35,58,0.45)] px-5"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-[14px] bg-white p-6 shadow-[0_24px_48px_rgba(22,35,58,0.18)]"
          >
            <div className="mb-5 text-[14.5px] leading-[1.5] text-[#16233A]">{confirmText}</div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-[10px] bg-[#EAF0F5] px-4 py-2.5 text-[13.5px] font-semibold text-[#4F6478]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="cursor-pointer rounded-[10px] bg-[#C13B3B] px-4 py-2.5 text-[13.5px] font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
