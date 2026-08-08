import { getSiteSettings } from "@/lib/settings";
import SocialIcon from "./SocialIcon";

export default async function SocialLinksGrid() {
  const site = await getSiteSettings();

  return (
    <div className="grid grid-cols-2 gap-3.5 min-[880px]:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] min-[880px]:gap-5">
      {site.socialLinks.map((soc) => (
        <a
          key={soc.key}
          href={soc.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col gap-1.5 rounded-2xl border border-border bg-white p-4 no-underline min-[880px]:gap-2.5 min-[880px]:p-6"
        >
          <div className="h-7 w-7 min-[880px]:h-9 min-[880px]:w-9">
            <SocialIcon platform={soc.key} size={28} />
          </div>
          <div className="text-[11px] font-semibold tracking-[1.5px] text-green uppercase min-[880px]:text-[13px] min-[880px]:tracking-[2px]">
            {soc.label}
          </div>
          <div className="text-[13.5px] font-semibold text-green-dark min-[880px]:text-[15px]">{soc.handle}</div>
          <div className="text-[12px] text-text-muted min-[880px]:text-[13px]">{soc.note}</div>
        </a>
      ))}
    </div>
  );
}
