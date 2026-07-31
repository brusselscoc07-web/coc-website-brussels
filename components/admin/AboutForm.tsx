"use client";

import { useState, useTransition } from "react";
import { saveAbout, type AboutFormState } from "@/app/admin/(authenticated)/about/actions";
import type { AboutSetting } from "@/lib/settings";
import { useToast } from "./ToastProvider";

const inputClass = "w-full rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";
const cardClass = "rounded-[14px] border border-[#DCE7F0] bg-white p-6";

export default function AboutForm({ about }: { about: AboutSetting }) {
  const [draft, setDraft] = useState<AboutSetting>(about);
  const [state, setState] = useState<AboutFormState>({});
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function field<K extends keyof AboutSetting>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((d) => ({ ...d, [key]: e.target.value }));
  }

  function addWorshipItem() {
    setDraft((d) => ({ ...d, worshipItems: [...d.worshipItems, { id: crypto.randomUUID(), label: "" }] }));
  }
  function removeWorshipItem(id: string) {
    setDraft((d) => ({ ...d, worshipItems: d.worshipItems.filter((w) => w.id !== id) }));
  }
  function setWorshipItemLabel(id: string, label: string) {
    setDraft((d) => ({ ...d, worshipItems: d.worshipItems.map((w) => (w.id === id ? { ...w, label } : w)) }));
  }

  function handleSave() {
    setState({});
    startTransition(async () => {
      const result = await saveAbout(draft);
      setState(result);
      if (result.success) showToast("About page saved");
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-[18px]">
        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Who We Are</div>
          <label className={labelClass} htmlFor="statement">
            Statement
          </label>
          <textarea
            id="statement"
            value={draft.statement}
            onChange={field("statement")}
            rows={6}
            className={`${inputClass} resize-y`}
          />
          {state.fieldErrors?.statement && (
            <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.statement}</p>
          )}
        </div>

        <div className={cardClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[15px] font-semibold text-[#16233A]">Our Worship Consists Of</div>
            <button type="button" onClick={addWorshipItem} className="cursor-pointer text-[13px] text-[#2E90D9]">
              + Add Item
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {draft.worshipItems.map((wi, i) => (
              <div key={wi.id} className="flex items-center gap-2.5">
                <span className="w-[22px] text-[13px] font-bold text-[#2E90D9]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <input
                  value={wi.label}
                  onChange={(e) => setWorshipItemLabel(wi.id, e.target.value)}
                  className="flex-1 rounded-[8px] border border-[#CBD9E5] px-3.5 py-3 text-[14px]"
                />
                <button
                  type="button"
                  onClick={() => removeWorshipItem(wi.id)}
                  className="cursor-pointer text-[13px] text-[#C13B3B]"
                >
                  Remove
                </button>
              </div>
            ))}
            {draft.worshipItems.length === 0 && <div className="text-[13px] text-[#7C93AA]">No items yet.</div>}
          </div>
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Worship Details</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="worshipPlace">
                Worship Place
              </label>
              <input
                id="worshipPlace"
                value={draft.worshipPlace}
                onChange={field("worshipPlace")}
                className={inputClass}
              />
              {state.fieldErrors?.worshipPlace && (
                <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.worshipPlace}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="preacher">
                Preacher
              </label>
              <input id="preacher" value={draft.preacher} onChange={field("preacher")} className={inputClass} />
              {state.fieldErrors?.preacher && (
                <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.preacher}</p>
              )}
            </div>
          </div>

          <p className="mt-3 text-[12px] text-[#7C93AA]">
            Address and Service Times are shared with the footer — edit those under Site Settings.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="zoomLink">
                Zoom link
              </label>
              <input id="zoomLink" value={draft.zoomLink} onChange={field("zoomLink")} className={inputClass} />
              {state.fieldErrors?.zoomLink && (
                <p className="mt-1.5 text-[13px] text-[#C13B3B]">{state.fieldErrors.zoomLink}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="zoomNote">
                Zoom note
              </label>
              <input id="zoomNote" value={draft.zoomNote} onChange={field("zoomNote")} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {state.error && <p className="mt-[18px] text-[14px] text-[#C13B3B]">{state.error}</p>}
      {state.success && <p className="mt-[18px] text-[14px] text-[#1F8A4C]">Saved — the About page is updated.</p>}

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
