import { getSiteSettings } from "@/lib/settings";
import SocialIcon from "./SocialIcon";

export default async function SocialIconRow({ size = 38 }: { size?: number }) {
  const site = await getSiteSettings();

  return (
    <div className="flex flex-nowrap gap-3">
      {site.socialLinks.map((soc) => (
        <a
          key={soc.key}
          href={soc.url}
          target="_blank"
          rel="noreferrer"
          style={{ width: size, height: size }}
          className="flex flex-shrink-0"
        >
          <SocialIcon platform={soc.key} size={size} />
        </a>
      ))}
    </div>
  );
}
