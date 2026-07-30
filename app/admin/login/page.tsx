"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="mx-auto max-w-[420px] px-8 py-24">
      <div className="mb-8 text-center">
        <div className="mb-2.5 text-[13px] tracking-[3px] text-gold uppercase">Staff Access</div>
        <div className="font-serif text-[36px] font-bold text-green-dark">Admin Login</div>
      </div>
      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="username"
          required
          className="rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          className="rounded-[10px] border border-border px-4 py-3.5 font-sans text-[14px]"
        />
        {state.error && <p className="text-[13px] text-live">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-full bg-green px-7 py-3 text-[14px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
