"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  function submit() {
    if (!form.name || !form.email || !form.message) return;
    setSuccess(true);
    setForm({ name: "", email: "", message: "" });
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-bg-alt p-6 text-[15px] text-green">
        Thank you — your message has been sent. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]"
      />
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        rows={10}
        className="min-h-[220px] resize-y rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]"
      />
      <button onClick={submit} className="cursor-pointer self-start rounded-full bg-green px-7 py-3 text-[14px] text-bg">
        Send Message
      </button>
    </div>
  );
}
