"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./ToastProvider";

// Server Actions across the admin redirect back with `?saved=<message>` on
// success (see the various actions.ts files) — this is the one place that
// watches for it, fires the toast, and strips the param so a page refresh
// doesn't re-show it. Mounted once in the admin layout, works on every page.
export default function SaveToastListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const saved = searchParams.get("saved");
    if (!saved) return;
    // URLSearchParams.get() already URL-decodes — savedRedirectPath() only
    // needs to encode once when building the redirect target.
    showToast(saved);
    const params = new URLSearchParams(searchParams);
    params.delete("saved");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
