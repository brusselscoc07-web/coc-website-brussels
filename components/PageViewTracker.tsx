"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Renders nothing — fires a fire-and-forget beacon on mount and on every
// client-side route change, so App Router navigations (which don't do a full
// page reload) still get counted. Only mounted for public pages, see
// components/ConditionalChrome.tsx.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
