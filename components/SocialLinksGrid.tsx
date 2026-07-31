import { getSiteSettings } from "@/lib/settings";
import SocialIcon from "./SocialIcon";

export default async function SocialLinksGrid() {
  const site = await getSiteSettings();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
      {site.socialLinks.map((soc) => (
        <a
          key={soc.key}
          href={soc.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col gap-2.5 rounded-2xl border border-border bg-white p-6 no-underline"
        >
          <div className="h-9 w-9">
            <SocialIcon platform={soc.key} size={36} />
          </div>
          <div className="text-[13px] font-semibold tracking-[2px] text-green uppercase">{soc.label}</div>
          <div className="text-[15px] font-semibold text-green-dark">{soc.handle}</div>
          <div className="text-[13px] text-text-muted">{soc.note}</div>
        </a>
      ))}
    </div>
  );
}
