"use client";

import { useEffect, useState } from "react";
import { BRUSSELS_TZ } from "@/lib/timezone";

function formatIn(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

// Renders a UTC instant as "12:30 PM CET" (Brussels — deterministic, safe for
// SSR) and, once mounted, appends "· 6:30 AM EST (your time)" using the
// visitor's own browser timezone. The viewer-local half is intentionally
// absent until after mount: the server has no way to know it, so rendering it
// during SSR would either guess wrong or mismatch the client's first paint.
export default function DualTimezoneTime({ iso, className }: { iso: string; className?: string }) {
  const [viewerTz, setViewerTz] = useState<string | null>(null);

  useEffect(() => {
    setViewerTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const date = new Date(iso);
  const brusselsLabel = formatIn(date, BRUSSELS_TZ);

  if (!viewerTz || viewerTz === BRUSSELS_TZ) {
    return <span className={className}>{brusselsLabel}</span>;
  }

  return (
    <span className={className}>
      {brusselsLabel} <span className="text-text-muted">· {formatIn(date, viewerTz)} (your time)</span>
    </span>
  );
}
