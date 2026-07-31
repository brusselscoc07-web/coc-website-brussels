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
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : (existingImageUrl ?? null));
        }}
        className="w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]"
      />
    </div>
  );
}
