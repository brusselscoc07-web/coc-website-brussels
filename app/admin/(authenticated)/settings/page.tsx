import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import Topbar from "@/components/admin/Topbar";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  const site = await getSiteSettings();

  return (
    <div>
      <Topbar title="Site Settings" subtitle="Location, map, footer and social links" />
      <div className="px-6 py-8 md:px-9">
        <SiteSettingsForm site={site} />
      </div>
    </div>
  );
}
