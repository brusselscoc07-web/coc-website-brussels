import { env } from "@/lib/env";

export type SessionData = {
  adminUserId?: string;
  adminEmail?: string;
  adminRole?: string;
};

// Kept free of `next/headers` so it's importable from both middleware.ts
// (edge runtime, uses iron-session's unsealData directly) and lib/auth/session.ts
// (uses next/headers cookies() inside Server Actions/Components).
export const sessionOptions = {
  cookieName: "coc_admin_session",
  password: env.SESSION_SECRET,
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
