import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const COOKIE_NAME = "coc_visitor";

function sign(id: string): string {
  const sig = createHmac("sha256", env.SESSION_SECRET).update(id).digest("hex");
  return `${id}.${sig}`;
}

function verify(value: string): string | null {
  const dot = value.lastIndexOf(".");
  if (dot === -1) return null;
  const id = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = createHmac("sha256", env.SESSION_SECRET).update(id).digest("hex");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return null;
  return timingSafeEqual(sigBuf, expectedBuf) ? id : null;
}

// Read-only — safe to call from a Server Component render. Returns null for a
// first-time visitor rather than creating a cookie (Next.js only allows
// setting cookies from a Server Action / Route Handler).
export async function getVisitorId(): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  return existing ? verify(existing) : null;
}

// Read-or-create — only callable from a Server Action / Route Handler. Used
// by the reaction toggle so a cookie is set on first use rather than for every visitor up front.
export async function ensureVisitorId(): Promise<string> {
  const existing = await getVisitorId();
  if (existing) return existing;

  const id = randomUUID();
  const store = await cookies();
  store.set(COOKIE_NAME, sign(id), {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
