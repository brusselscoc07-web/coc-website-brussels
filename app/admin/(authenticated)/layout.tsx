import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sermons", label: "Resources" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/livestream", label: "Livestream" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-alt">
      <div className="border-b border-border bg-white px-8 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6">
          <Link href="/admin" className="font-serif text-[18px] font-bold text-green-dark no-underline">
            Church Office
          </Link>
          <nav className="flex flex-wrap gap-5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[14px] text-text no-underline hover:text-green">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
