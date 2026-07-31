"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F7FB] px-5 font-sans">
      <div className="w-full max-w-[480px] rounded-[20px] border border-[#DCE7F0] bg-white p-9 shadow-[0_24px_48px_rgba(22,35,58,0.08)] sm:p-[52px]">
        <div className="mb-8 text-center">
          <div className="font-serif text-[30px] font-bold text-[#16233A]">Church of Christ</div>
          <div className="mt-[5px] text-[12.5px] uppercase tracking-[3px] text-[#7C93AA]">Brussels · Admin</div>
        </div>
        <form action={formAction} className="flex flex-col gap-[18px]">
          <label className="text-[13.5px] text-[#7C93AA]">
            Email
            <input
              name="email"
              type="email"
              placeholder="admin@cocbrussels.org"
              autoComplete="username"
              required
              className="mt-1.5 block w-full rounded-[10px] border border-[#CBDBE8] px-4 py-3.5 font-sans text-[16px]"
            />
          </label>
          <label className="text-[13.5px] text-[#7C93AA]">
            Password
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="mt-1.5 block w-full rounded-[10px] border border-[#CBDBE8] px-4 py-3.5 font-sans text-[16px]"
            />
          </label>
          {state.error && <p className="text-[13.5px] text-[#C13B3B]">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1.5 cursor-pointer rounded-[10px] bg-[#2E90D9] px-5 py-[15px] text-center text-[16px] font-semibold text-white transition-colors hover:bg-[#1F6FB0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
