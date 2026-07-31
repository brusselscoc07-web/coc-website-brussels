"use client";

import { useActionState } from "react";
import { changePassword, updateProfile, type ProfileFormState } from "@/app/admin/(authenticated)/profile/actions";

const initialState: ProfileFormState = {};
const inputClass = "w-full rounded-[8px] border border-[#CBDBE8] px-3.5 py-3 font-sans text-[14px]";
const labelClass = "mb-1.5 block text-[12.5px] text-[#7C93AA]";
const cardClass = "rounded-[14px] border border-[#DCE7F0] bg-white p-6";

function initialsOf(name: string, email: string) {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function ProfileForm({ name, email, role }: { name: string; email: string; role: string }) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, initialState);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-[18px]">
        <div className={cardClass}>
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2E90D9] text-[18px] font-semibold text-white">
              {initialsOf(name, email)}
            </div>
            <div>
              <div className="text-[16px] font-semibold text-[#16233A]">{name || "Admin"}</div>
              <div className="text-[12.5px] text-[#7C93AA]">{role}</div>
            </div>
          </div>
          <form action={profileAction} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Name
                </label>
                <input id="name" name="name" defaultValue={name} className={inputClass} />
                {profileState.fieldErrors?.name && (
                  <p className="mt-1.5 text-[13px] text-[#C13B3B]">{profileState.fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input id="email" name="email" type="email" defaultValue={email} className={inputClass} />
                {profileState.fieldErrors?.email && (
                  <p className="mt-1.5 text-[13px] text-[#C13B3B]">{profileState.fieldErrors.email}</p>
                )}
              </div>
            </div>
            {profileState.error && <p className="text-[13.5px] text-[#C13B3B]">{profileState.error}</p>}
            {profileState.success && <p className="text-[13.5px] text-[#1F8A4C]">Saved.</p>}
            <button
              type="submit"
              disabled={profilePending}
              className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profilePending ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className={cardClass}>
          <div className="mb-4 text-[15px] font-semibold text-[#16233A]">Change password</div>
          <form action={passwordAction} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="currentPassword">
                  Current password
                </label>
                <input id="currentPassword" name="currentPassword" type="password" className={inputClass} />
                {passwordState.fieldErrors?.currentPassword && (
                  <p className="mt-1.5 text-[13px] text-[#C13B3B]">{passwordState.fieldErrors.currentPassword}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="newPassword">
                  New password
                </label>
                <input id="newPassword" name="newPassword" type="password" className={inputClass} />
                {passwordState.fieldErrors?.newPassword && (
                  <p className="mt-1.5 text-[13px] text-[#C13B3B]">{passwordState.fieldErrors.newPassword}</p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="confirmPassword">
                  Confirm new password
                </label>
                <input id="confirmPassword" name="confirmPassword" type="password" className={inputClass} />
                {passwordState.fieldErrors?.confirmPassword && (
                  <p className="mt-1.5 text-[13px] text-[#C13B3B]">{passwordState.fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            {passwordState.error && <p className="text-[13.5px] text-[#C13B3B]">{passwordState.error}</p>}
            {passwordState.success && <p className="text-[13.5px] text-[#1F8A4C]">Password updated.</p>}
            <button
              type="submit"
              disabled={passwordPending}
              className="cursor-pointer self-start rounded-[10px] bg-[#2E90D9] px-6 py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordPending ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
