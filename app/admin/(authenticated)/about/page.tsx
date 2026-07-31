import AboutForm from "@/components/admin/AboutForm";
import Topbar from "@/components/admin/Topbar";
import { getAboutContent } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  return (
    <div>
      <Topbar title="About Page" subtitle="Statement, worship order, and invitation shown on About Us" />
      <div className="px-6 py-8 md:px-9">
        <AboutForm about={about} />
      </div>
    </div>
  );
}
