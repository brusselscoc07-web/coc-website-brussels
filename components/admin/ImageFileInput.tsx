"use client";

import { useEffect, useState } from "react";

export default function ImageFileInput({
  id,
  name,
  existingImageUrl,
  accept = "image/jpeg,image/png,image/webp",
}: {
  id: string;
  name: string;
  existingImageUrl?: string | null;
  accept?: string;
}) {
  const [preview, setPreview] = useState<string | null>(existingImageUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Revoke the previous blob: URL when replaced or on unmount, so picking a
  // few different files in a row doesn't leak memory.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#CBD9E5] bg-[#F2F7FB]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#A8B7C6" strokeWidth="1.8" />
            <circle cx="8.5" cy="10" r="1.5" fill="#A8B7C6" />
            <path d="M4 17l5-5 3 3 4-4 4 4" stroke="#A8B7C6" strokeWidth="1.8" />
          </svg>
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <label
          htmlFor={id}
          className="shrink-0 cursor-pointer rounded-[8px] bg-[#2E90D9] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#2679BC]"
        >
          Choose File
        </label>
        <span className="min-w-0 truncate text-[13px] text-[#7C93AA]">
          {fileName ?? (existingImageUrl ? "Current image kept — choose a new one to replace it" : "No file chosen")}
        </span>
        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : (existingImageUrl ?? null));
            setFileName(file ? file.name : null);
          }}
          className="sr-only"
        />
      </div>
    </div>
  );
}
