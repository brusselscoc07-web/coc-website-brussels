"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import PageViewTracker from "./PageViewTracker";

// Root layout renders the public SiteHeader/SiteFooter as Server Components
// and hands them to this Client Component as props (not imported here) — the
// standard Next.js pattern for keeping a pathname-conditional check on the
// client without forcing header/footer themselves to become client components.
export default function ConditionalChrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <PageViewTracker />
      {header}
      {children}
      {footer}
    </>
  );
}
