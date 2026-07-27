import { location } from "@/lib/data";
import SocialIconRow from "./SocialIconRow";

export default function SiteFooter() {
  return (
    <div className="shrink-0 bg-green-dark px-8 pb-7 pt-14 text-cream">
      <div className="mx-auto mb-8 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
        <div>
          <div className="mb-1.5 font-serif text-[22px] font-bold">Church of Christ</div>
          <div className="mb-3.5 text-[12px] tracking-[2px] text-gold uppercase">Brussels</div>
          <div className="text-[13px] leading-[1.7] text-footer-muted">
            A family of faith devoted to Scripture, worship, and one another.
          </div>
        </div>
        <div>
          <div className="mb-3 text-[13px] font-semibold text-cream">Service Times</div>
          <div className="text-[13px] leading-[1.8] text-footer-muted">
            Friday: 20:00 – 21:30
            <br />
            Sunday: 12:30 – 15:00
          </div>
        </div>
        <div>
          <div className="mb-3 text-[13px] font-semibold text-cream">Visit</div>
          <div className="text-[13px] leading-[1.8] text-footer-muted">
            {location.address}
            <br />
            {location.phone}
          </div>
        </div>
        <div>
          <div className="mb-3 text-[13px] font-semibold text-cream">Follow</div>
          <SocialIconRow size={32} />
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-[rgba(241,233,216,0.15)] pt-5 text-center text-[12px] text-footer-faint">
        © 2026 Church of Christ Brussels. All rights reserved.
      </div>
    </div>
  );
}
