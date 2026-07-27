"use client";

import { useState } from "react";
import Link from "next/link";
import type { ChurchEvent } from "@/lib/data";

export default function PastEventsToggle({ pastEvents }: { pastEvents: ChurchEvent[] }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow((v) => !v)}
        className="mb-4 cursor-pointer text-[14px] font-semibold text-green"
      >
        {show ? "Hide past events" : `Show past events (${pastEvents.length})`}
      </button>
      {show && (
        <div className="flex flex-col gap-3.5 opacity-75">
          {pastEvents.map((ev) => (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className="flex flex-wrap justify-between gap-1.5 rounded-xl bg-bg-alt px-5 py-4 no-underline"
            >
              <span className="text-[14px] font-semibold text-text">{ev.title}</span>
              <span className="text-[13px] text-text-muted">{ev.date}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
