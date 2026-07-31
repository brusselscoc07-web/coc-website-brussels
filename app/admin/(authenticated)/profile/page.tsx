import { eq } from "drizzle-orm";
import ProfileForm from "@/components/admin/ProfileForm";
import Topbar from "@/components/admin/Topbar";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getSession();
  const db = await getDb();
  const [admin] = session.adminUserId
    ? await db
        .select({ name: adminUsers.name, email: adminUsers.email, role: adminUsers.role })
        .from(adminUsers)
        .where(eq(adminUsers.id, session.adminUserId))
    : [];

  return (
    <div>
      <Topbar title="Admin Profile" subtitle="Your account details and password" />
      <div className="px-6 py-8 md:px-9">
        <ProfileForm name={admin?.name ?? ""} email={admin?.email ?? session.adminEmail ?? ""} role={admin?.role ?? ""} />
      </div>
    </div>
  );
}
