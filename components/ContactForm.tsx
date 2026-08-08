"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { success: false };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl bg-bg-alt p-6 text-[15px] text-green">
        Thank you — your message has been sent. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <input
          name="name"
          placeholder="Name"
          className="w-full rounded-[10px] border-2 border-border px-4 py-3.5 font-sans text-[16px] min-[880px]:text-[14px]"
        />
        {state.fieldErrors?.name && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.name}</p>}
      </div>
      <div>
        <input
          name="email"
          placeholder="Email"
          className="w-full rounded-[10px] border-2 border-border px-4 py-3.5 font-sans text-[16px] min-[880px]:text-[14px]"
        />
        {state.fieldErrors?.email && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.email}</p>}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Message"
          rows={10}
          className="min-h-[220px] w-full resize-y rounded-[10px] border-2 border-border px-4 py-3.5 font-sans text-[16px] min-[880px]:text-[14px]"
        />
        {state.fieldErrors?.message && <p className="mt-1.5 text-[13px] text-live">{state.fieldErrors.message}</p>}
      </div>
      {state.error && (
        <p className="text-[13px] text-live">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer self-start rounded-full bg-green px-7 py-3 text-[14px] text-bg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
