import { eq } from "drizzle-orm";
import Link from "next/link";
import { logout } from "@/app/admin/(authenticated)/actions";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

function initialsOf(name: string | undefined, email: string | undefined) {
  const source = (name || email || "?").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default async function Topbar({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  const session = await getSession();
  const db = await getDb();
  const [admin] = session.adminUserId
    ? await db.select({ name: adminUsers.name }).from(adminUsers).where(eq(adminUsers.id, session.adminUserId))
    : [];

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#DCE7F0] bg-white px-6 py-2.5 md:px-9">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex shrink-0 items-center gap-1 rounded-full border border-[#DCE7F0] px-3 py-1.5 text-[13px] font-semibold text-[#2E90D9] no-underline hover:bg-[#F2F7FB]"
          >
            ← Back
          </Link>
        )}
        <div className="min-w-0">
          <div className="text-[16px] font-bold leading-tight text-[#16233A]">{title}</div>
          {subtitle && <div className="text-[11.5px] leading-tight text-[#7C93AA]">{subtitle}</div>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <form action={logout}>
          <button type="submit" className="cursor-pointer text-[13px] text-[#7C93AA] hover:text-[#16233A]">
            Log Out
          </button>
        </form>
        <Link
          href="/admin/profile"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#2E90D9] text-[12.5px] font-semibold text-white no-underline"
        >
          {initialsOf(admin?.name ?? undefined, session.adminEmail)}
        </Link>
      </div>
    </div>
  );
}
