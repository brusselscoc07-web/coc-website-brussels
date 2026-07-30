import { getLivestreamStatus } from "@/lib/settings";
import { setLivestreamStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLivestreamPage() {
  const status = await getLivestreamStatus();

  return (
    <div className="mx-auto max-w-2xl px-8 py-14">
      <div className="mb-8 font-serif text-[32px] font-bold text-green-dark">Livestream</div>

      <div className="mb-6 rounded-2xl border border-border bg-white p-6">
        <div className="mb-1 text-[12px] tracking-[1px] text-gold uppercase">Current status</div>
        <div className="font-serif text-[24px] font-bold" style={{ color: status.isLive ? "#B3392C" : "#2C4A3D" }}>
          {status.isLive ? "🔴 Live now" : "Offline"}
        </div>
        {status.toggledAt && (
          <div className="mt-1 text-[13px] text-text-muted">
            Last changed {new Date(status.toggledAt).toLocaleString("en-US")}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <form action={setLivestreamStatus.bind(null, true)}>
          <button
            type="submit"
            disabled={status.isLive}
            className="cursor-pointer rounded-full bg-live px-6 py-3 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Go Live
          </button>
        </form>
        <form action={setLivestreamStatus.bind(null, false)}>
          <button
            type="submit"
            disabled={!status.isLive}
            className="cursor-pointer rounded-full bg-green px-6 py-3 text-[14px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            End Livestream
          </button>
        </form>
      </div>
      <p className="mt-6 text-[13px] text-text-muted">
        This controls the &ldquo;Live&rdquo; state shown on the homepage. Start the actual Zoom call separately —
        this toggle doesn&apos;t start or stop anything, it just tells visitors whether to expect a stream right now.
      </p>
    </div>
  );
}
