"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS: Record<string, React.ReactNode> = {
  dash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  ),
  about: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  hero: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path d="M4 17l5-5 3 3 4-4 4 4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  res: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11h8M8 15h8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  ev: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  gal: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 16l-5-5-4 4-3-3-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  comments: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16v11H9l-5 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  live: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  set: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.4-4.2 4.3-6.2 7.5-6.2s6.1 2 7.5 6.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "dash", exact: true },
  { href: "/admin/hero", label: "Homepage Hero", icon: "hero" },
  { href: "/admin/about", label: "About Page", icon: "about" },
  { href: "/admin/sermons", label: "Resources", icon: "res" },
  { href: "/admin/events", label: "Events", icon: "ev" },
  { href: "/admin/albums", label: "Gallery", icon: "gal" },
  { href: "/admin/comments", label: "Comments", icon: "comments" },
  { href: "/admin/livestream", label: "Livestream", icon: "live" },
  { href: "/admin/settings", label: "Site Settings", icon: "set" },
  { href: "/admin/profile", label: "Profile", icon: "profile" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="w-full shrink-0 bg-[#16233A] md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-[248px] md:overflow-y-auto">
      <div className="px-5 pb-3.5 pt-4">
        <div className="font-serif text-[20px] font-bold text-[#F4F5F9]">Church of Christ</div>
        <div className="mt-[3px] text-[10.5px] uppercase tracking-[2.5px] text-[#93A9C2]">Brussels · Admin</div>
      </div>

      <nav className="flex flex-col gap-0.5 border-t border-[#223756] px-3 pb-3 pt-2.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, "exact" in item ? item.exact : false);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] no-underline transition-colors hover:bg-[#1E3350]"
              style={{
                color: active ? "#FFFFFF" : "#A6ABC2",
                background: active ? "#234067" : "transparent",
              }}
            >
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{ICONS[item.icon]}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
