import { getSession } from "@/lib/auth/session";
import { logout } from "./actions";

export default async function AdminHomePage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-[700px] px-8 py-20">
      <div className="mb-2 text-[13px] tracking-[3px] text-gold uppercase">Church Office</div>
      <div className="mb-6 font-serif text-[36px] font-bold text-green-dark">Admin Dashboard</div>
      <p className="mb-8 text-[15px] text-text">
        Signed in as <strong>{session.adminEmail}</strong> ({session.adminRole}).
      </p>
      <form action={logout}>
        <button
          type="submit"
          className="cursor-pointer rounded-full border border-border px-6 py-3 text-[14px] text-text"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
