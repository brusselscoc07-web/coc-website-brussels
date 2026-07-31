"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings, type SiteSettingsFormState } from "@/app/admin/(authenticated)/settings/actions";
import { mapHref } from "@/lib/data";
import type { SiteSetting } from "@/lib/settings";
import { DEFAULT_TIME, type TimeValue } from "@/lib/time";
import { CHURCH_TIMEZONES } from "@/lib/timezone";
import TimePicker from "./TimePicker";
import { useToast } from "./ToastProvider";

const inputClass = "w-full rounded-[8px] border border-[#CBDBE8] px-3.5 py-3 font-sans text-[14px]";
const selectClass = "w-full rounded-[8px] border border-[#CBDBE8] bg-white px-3.5 py-3 font-sans text-[14px]";
const smallInputClass = "w-full rounded-[8px] border border-[#CBDBE8] px-3 py-2.5 font-sans text-[13.5px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";
const cardClass = "rounded-[14px] border border-[#DCE7F0] bg-white p-6";

function sanitizePhone(value: string) {
  return value.replace(/[^0-9+\-\s]/g, "");
}

export default function SiteSettingsForm({ site }: { site: SiteSetting }) {
  const [draft, setDraft] = useState<SiteSetting>(site);
  const [state, setState] = useState<SiteSettingsFormState>({});
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function field<K extends keyof SiteSetting>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((d) => ({ ...d, [key]: e.target.value }));
  }

  function addServiceTime() {
    setDraft((d) => ({
      ...d,
      serviceTimes: [...d.serviceTimes, { id: crypto.randomUUID(), day: "", start: { ...DEFAULT_TIME }, end: null }],
    }));
  }
  function removeServiceTime(id: string) {
    setDraft((d) => ({ ...d, serviceTimes: d.serviceTimes.filter((t) => t.id !== id) }));
  }
  function setServiceTimeDay(id: string, day: string) {
    setDraft((d) => ({ ...d, serviceTimes: d.serviceTimes.map((t) => (t.id === id ? { ...t, day } : t)) }));
  }
  function setServiceTimeStart(id: string, start: TimeValue) {
    setDraft((d) => ({ ...d, serviceTimes: d.serviceTimes.map((t) => (t.id === id ? { ...t, start } : t)) }));
  }
  function setServiceTimeEnd(id: string, end: TimeValue | null) {
    setDraft((d) => ({ ...d, serviceTimes: d.serviceTimes.map((t) => (t.id === id ? { ...t, end } : t)) }));
  }

  function setSocialField(key: SiteSetting["socialLinks"][number]["key"], field: "handle" | "url", value: string) {
    setDraft((d) => ({
      ...d,
      socialLinks: d.socialLinks.map((sl) => (sl.key === key ? { ...sl, [field]: value } : sl)),
    }));
  }

  function handleSave() {
    setState({});
    startTransition(async () => {
      const result = await saveSiteSettings(draft);
      setState(result);
      if (result.success) showToast("Site settings saved");
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-[18px]">
        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Location &amp; Map</div>
          <label className={labelClass} htmlFor="address">
            Address
          </label>
          <input id="address" value={draft.address} onChange={field("address")} className={inputClass} />
          {state.fieldErrors?.address && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.address}</p>}
          <a
            href={mapHref(draft.address)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[12.5px] font-semibold text-[#2E90D9] no-underline"
          >
            Preview pin in Google Maps →
          </a>
          <p className="mt-3 text-[12px] text-[#7C93AA]">Shown in the footer, Contact page, and About page.</p>
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Timezone</div>
          <label className={labelClass} htmlFor="timezone">
            Service times are entered and shown in this timezone
          </label>
          <select
            id="timezone"
            value={draft.timezone}
            onChange={(e) => setDraft((d) => ({ ...d, timezone: e.target.value }))}
            className={selectClass}
          >
            {CHURCH_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className={cardClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[15px] font-semibold text-[#16233A]">Service Times</div>
            <button type="button" onClick={addServiceTime} className="cursor-pointer text-[13px] text-[#2E90D9]">
              + Add Time
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {draft.serviceTimes.map((t) => (
              <div key={t.id} className="rounded-[10px] border border-[#EEF2F6] p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <input
                    value={t.day}
                    onChange={(e) => setServiceTimeDay(t.id, e.target.value)}
                    placeholder="Day (e.g. Sunday)"
                    className="flex-1 rounded-[8px] border border-[#CBDBE8] px-3.5 py-3 text-[14px]"
                  />
                  <button
                    type="button"
                    onClick={() => removeServiceTime(t.id)}
                    className="cursor-pointer text-[13px] text-[#C13B3B]"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <div className="mb-1 text-[11.5px] text-[#7C93AA]">Starts</div>
                    <TimePicker value={t.start} onChange={(v) => setServiceTimeStart(t.id, v)} />
                  </div>
                  {t.end ? (
                    <div>
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-[#7C93AA]">
                        <span>Ends</span>
                        <button
                          type="button"
                          onClick={() => setServiceTimeEnd(t.id, null)}
                          className="cursor-pointer text-[#C13B3B]"
                        >
                          Remove end time
                        </button>
                      </div>
                      <TimePicker value={t.end} onChange={(v) => setServiceTimeEnd(t.id, v)} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setServiceTimeEnd(t.id, { ...DEFAULT_TIME })}
                      className="cursor-pointer self-end text-[13px] text-[#2E90D9]"
                    >
                      + Add end time
                    </button>
                  )}
                </div>
              </div>
            ))}
            {draft.serviceTimes.length === 0 && <div className="text-[13px] text-[#7C93AA]">No times yet.</div>}
          </div>
          <p className="mt-3 text-[12px] text-[#7C93AA]">Shown on the About page and in the footer.</p>
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Footer Tagline</div>
          <textarea value={draft.tagline} onChange={field("tagline")} rows={2} className={`${inputClass} resize-y`} />
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Contact</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: sanitizePhone(e.target.value) }))}
                inputMode="tel"
                placeholder="+32 2 123 45 67"
                className={inputClass}
              />
              {state.fieldErrors?.phone && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.phone}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="hours">
                Office hours
              </label>
              <input id="hours" value={draft.hours} onChange={field("hours")} className={inputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelClass} htmlFor="email">
              Public contact email (optional)
            </label>
            <input id="email" value={draft.email} onChange={field("email")} className={inputClass} />
            {state.fieldErrors?.email && <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.email}</p>}
          </div>
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Stay Connected</div>
          <div className="flex flex-col gap-4">
            {draft.socialLinks.map((sl) => (
              <div key={sl.key} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[110px_1fr_1fr]">
                <div className="text-[13px] font-semibold text-[#16233A]">{sl.label}</div>
                <label className="text-[11.5px] text-[#7C93AA]">
                  Handle
                  <input
                    value={sl.handle}
                    onChange={(e) => setSocialField(sl.key, "handle", e.target.value)}
                    className={`mt-1 block ${smallInputClass}`}
                  />
                </label>
                <label className="text-[11.5px] text-[#7C93AA]">
                  URL
                  <input
                    value={sl.url}
                    onChange={(e) => setSocialField(sl.key, "url", e.target.value)}
                    className={`mt-1 block ${smallInputClass}`}
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[#7C93AA]">Footer icons, Contact page, and the homepage social grid.</p>
        </div>
      </div>

      {state.error && <p className="mt-[18px] text-[14px] text-[#C13B3B]">{state.error}</p>}
      {state.success && <p className="mt-[18px] text-[14px] text-[#1F8A4C]">Saved — the site is updated.</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="mt-[18px] cursor-pointer rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
