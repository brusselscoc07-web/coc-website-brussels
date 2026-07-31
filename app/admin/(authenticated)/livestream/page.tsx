import Topbar from "@/components/admin/Topbar";
import { getLivestreamStatus } from "@/lib/settings";
import { setLivestreamStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLivestreamPage() {
  const status = await getLivestreamStatus();

  return (
    <div>
      <Topbar title="Livestream" subtitle="Controls for the homepage livestream card" />
      <div className="max-w-5xl px-6 py-8 md:px-9">
        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1fr_320px]">
          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-3 w-3 shrink-0 rounded-full"
                style={{ background: status.isLive ? "#C13B3B" : "#A6ABC2" }}
              >
                {status.isLive && <span className="block h-3 w-3 animate-ping rounded-full bg-[#C13B3B]" />}
              </span>
              <div>
                <div className="text-[20px] font-bold" style={{ color: status.isLive ? "#C13B3B" : "#16233A" }}>
                  {status.isLive ? "Live now" : "Offline"}
                </div>
                {status.toggledAt ? (
                  <div className="text-[12.5px] text-[#7C93AA]">
                    Last changed {new Date(status.toggledAt).toLocaleString("en-US")}
                  </div>
                ) : (
                  <div className="text-[12.5px] text-[#7C93AA]">No changes yet</div>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t border-[#EEF2F6] pt-5">
              <form action={setLivestreamStatus.bind(null, true)}>
                <button
                  type="submit"
                  disabled={status.isLive}
                  className="cursor-pointer rounded-[10px] bg-[#C13B3B] px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🔴 Go Live
                </button>
              </form>
              <form action={setLivestreamStatus.bind(null, false)}>
                <button
                  type="submit"
                  disabled={!status.isLive}
                  className="cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  End Livestream
                </button>
              </form>
            </div>

            <p className="mt-5 text-[13px] leading-[1.6] text-[#7C93AA]">
              This only controls the &ldquo;Live&rdquo; badge shown on the homepage. It doesn&apos;t start or stop
              anything on Zoom — start the actual call separately, then flip this switch so visitors know to expect a
              stream right now.
            </p>
          </div>

          <div className="rounded-[14px] border border-[#DCE7F0] bg-white p-6">
            <div className="mb-3 text-[13px] font-semibold text-[#16233A]">What visitors see</div>
            {status.isLive ? (
              <div className="flex items-center gap-2 rounded-[10px] bg-[#FDEDED] px-3.5 py-3">
                <span className="h-2 w-2 rounded-full bg-[#C13B3B]" />
                <span className="text-[13px] font-semibold text-[#C13B3B]">🔴 LIVE NOW</span>
              </div>
            ) : (
              <div className="rounded-[10px] bg-[#F2F7FB] px-3.5 py-3 text-[13px] text-[#4F6478]">
                &ldquo;We&apos;re not live right now&rdquo; + the next scheduled service time
              </div>
            )}
            <p className="mt-3 text-[12px] leading-[1.6] text-[#7C93AA]">
              Shown on the homepage Livestream section. The Zoom join link and streaming location come from the
              Worship Details on{" "}
              <a href="/admin/about" className="font-semibold text-[#2E90D9] no-underline">
                About Page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
