"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { categories, navLinks, type SearchItem } from "@/lib/data";

function isActive(pathname: string, key: string) {
  if (key === "home") return pathname === "/" || pathname.startsWith("/contact") || pathname.startsWith("/join");
  if (key === "sermons") return pathname.startsWith("/sermons");
  if (key === "gallery") return pathname.startsWith("/gallery");
  if (key === "events") return pathname.startsWith("/events");
  return pathname.startsWith(`/${key}`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchItem[] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lazy, one-time fetch — most visitors never open search, and this keeps
  // the index reflecting DB content (sermons/events are admin-managed now)
  // without every page load querying the DB just for the header.
  useEffect(() => {
    if (!searchOpen || searchIndex !== null) return;
    fetch("/api/search-index")
      .then((res) => res.json())
      .then(setSearchIndex)
      .catch(() => setSearchIndex([]));
  }, [searchOpen, searchIndex]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q.length <= 1 || !searchIndex) return [];
    return searchIndex.filter((item) => (item.title + item.snippet).toLowerCase().includes(q)).slice(0, 6);
  }, [q, searchIndex]);

  function goToResult(href: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-8 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[22px] font-bold tracking-[0.3px] text-green">Church of Christ</span>
          <span className="mt-0.5 text-[11px] tracking-[3px] text-gold uppercase">Brussels</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 min-[880px]:flex">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.key);
            if (item.key === "sermons") {
              return (
                <div key={item.key} ref={dropdownRef} className="relative">
                  <span
                    onClick={() => setResourcesOpen((v) => !v)}
                    className="flex cursor-pointer items-center gap-1 pb-1.5 text-[15px]"
                    style={{
                      color: active ? "#1B2E25" : "#201F1B",
                      borderBottom: active ? "2px solid #C79A46" : "2px solid transparent",
                    }}
                  >
                    {item.label}
                    <span className="ml-0.5 text-[10px]">▾</span>
                  </span>
                  {resourcesOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 min-w-[200px] rounded-2xl border border-border bg-white p-2 shadow-[0_20px_40px_rgba(20,22,18,0.15)]">
                      <Link
                        href="/sermons"
                        className="block rounded-lg px-3.5 py-2.5 text-[14px] font-semibold text-green no-underline hover:bg-bg-alt"
                      >
                        All Resources
                      </Link>
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <Link
                            key={c}
                            href={`/sermons?category=${encodeURIComponent(c)}`}
                            className="block rounded-lg px-3.5 py-2.5 text-[14px] text-ink-soft no-underline hover:bg-bg-alt"
                          >
                            {c}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.key}
                href={item.href}
                className="pb-1.5 text-[15px] no-underline"
                style={{
                  color: active ? "#1B2E25" : "#201F1B",
                  borderBottom: active ? "2px solid #C79A46" : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="h-[19px] w-[19px] cursor-pointer">
            <SearchIcon />
          </button>
          <Link
            href="/join"
            className="cursor-pointer rounded-full bg-green px-[22px] py-2.5 text-[14px] tracking-[0.4px] text-bg no-underline hover:bg-green-dark"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-6 min-[880px]:hidden">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="h-[19px] w-[19px] cursor-pointer">
            <SearchIcon />
          </button>
          <button
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex w-[22px] cursor-pointer flex-col gap-1"
          >
            <span className="h-0.5 rounded bg-ink" />
            <span className="h-0.5 rounded bg-ink" />
            <span className="h-0.5 rounded bg-ink" />
          </button>
        </div>
      </div>

      {mobileMenuOpen &&
        createPortal(
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 min-[880px]:hidden"
          />,
          document.body,
        )}

      {mobileMenuOpen && (
        <div className="absolute right-8 top-full z-40 flex max-h-[calc(100vh-100px)] w-[min(260px,80vw)] flex-col gap-3.5 overflow-y-auto rounded-2xl border border-border bg-bg px-6 py-5 shadow-[0_20px_40px_rgba(20,22,18,0.18)] min-[880px]:hidden">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                className="text-[16px] no-underline"
                style={{ color: active ? "#2C4A3D" : "#201F1B", fontWeight: active ? 700 : 500 }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/join"
            className="cursor-pointer self-start rounded-full bg-green px-[22px] py-2.5 text-[14px] tracking-[0.4px] text-bg no-underline"
          >
            Join Us
          </Link>
        </div>
      )}

      {searchOpen &&
        createPortal(
          <div
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[90] flex justify-center bg-[rgba(20,22,18,0.6)] px-5 pt-[9vh] backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[74vh] w-[min(620px,92vw)] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(20,24,20,0.35)]"
            >
              <div className="flex items-center gap-3.5 border-b border-bg-alt px-[26px] pb-[18px] pt-6">
                <SearchIcon color="#6E6656" size={20} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sermons, events, pages..."
                  className="flex-1 border-none bg-transparent font-sans text-[17px] text-ink outline-none"
                />
                <button
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="cursor-pointer text-[20px] leading-none text-text-muted"
                >
                  ×
                </button>
              </div>
              <div className="overflow-auto px-[26px] pb-[26px] pt-5">
                {q.length > 1 && results.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    {results.map((r) => (
                      <div
                        key={r.href}
                        onClick={() => goToResult(r.href)}
                        className="flex cursor-pointer flex-col gap-1 rounded-2xl p-3.5 hover:bg-cream"
                      >
                        <span className="w-fit rounded-full bg-bg-alt px-2.5 py-[3px] text-[10.5px] font-semibold tracking-[1.2px] text-green uppercase">
                          {r.type}
                        </span>
                        <div className="text-[16px] font-semibold text-green-dark">{r.title}</div>
                        <div className="text-[13.5px] text-text-muted">{r.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}
                {q.length > 1 && results.length === 0 && searchIndex === null && (
                  <div className="py-10 text-center text-[14px] text-text-muted">Searching…</div>
                )}
                {q.length > 1 && results.length === 0 && searchIndex !== null && (
                  <div className="py-10 text-center text-[14px] text-text-muted">
                    No results for &quot;{query}&quot; — try different words.
                  </div>
                )}
                {q.length <= 1 && (
                  <div className="py-9 text-center text-[13.5px] text-text-faint">
                    Start typing to search sermons, events, and pages.
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function SearchIcon({ color = "#201F1B", size = 19 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.8" />
      <line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
