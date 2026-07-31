import { mapHref } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";
import SocialIconRow from "./SocialIconRow";

export default async function ContactInfo() {
  const site = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1.5 text-[12px] tracking-[1.5px] text-gold uppercase">Call Us</div>
        <div className="text-[15px] text-green-dark">{site.phone}</div>
        <div className="text-[13px] text-text-muted">{site.hours}</div>
      </div>
      {site.email && (
        <div>
          <div className="mb-1.5 text-[12px] tracking-[1.5px] text-gold uppercase">Email Us</div>
          <a href={`mailto:${site.email}`} className="text-[15px] text-green-dark no-underline">
            {site.email}
          </a>
        </div>
      )}
      <div>
        <div className="mb-1.5 text-[12px] tracking-[1.5px] text-gold uppercase">Visit Us</div>
        <div className="mb-2.5 text-[15px] text-green-dark">{site.address}</div>
        <div
          className="relative mb-2.5 h-40 overflow-hidden rounded-2xl bg-bg-alt"
          style={{
            backgroundImage:
              "linear-gradient(#E7DFCE 1px, transparent 1px), linear-gradient(90deg,#E7DFCE 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-4 w-4 rounded-[50%_50%_50%_0] bg-green"
            style={{ transform: "translate(-50%,-100%) rotate(-45deg)" }}
          />
        </div>
        <a href={mapHref(site.address)} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-green no-underline">
          Open in Maps →
        </a>
      </div>
      <div>
        <div className="mb-2 text-[12px] tracking-[1.5px] text-gold uppercase">Follow Us</div>
        <SocialIconRow size={38} />
      </div>
    </div>
  );
}
