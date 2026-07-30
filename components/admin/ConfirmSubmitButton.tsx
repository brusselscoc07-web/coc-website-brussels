"use client";

import type { ReactNode } from "react";

export default function ConfirmSubmitButton({
  children,
  confirmText,
  className,
}: {
  children: ReactNode;
  confirmText: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className={className ?? "cursor-pointer text-[13px] font-semibold text-live"}
    >
      {children}
    </button>
  );
}
