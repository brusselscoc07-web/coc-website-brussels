"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const GENERIC_ERROR = "Invalid email or password.";
// Pre-computed bcrypt hash with no matching password, compared against on a
// nonexistent-user login attempt so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2b$12$Egx3zOlh5Wtq9fuiP9Uvv.lg8udDMuOFQjiIvh1Me9Siob6wxX656";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  // Rate-limited by IP separately from the per-account lockout below, to
  // blunt distributed guessing across many admin_users rows (or nonexistent ones).
  const allowed = await checkRateLimit("login", { limit: 10, windowSeconds: 600 });
  if (!allowed) return { error: "Too many attempts. Try again in a few minutes." };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: GENERIC_ERROR };

  const db = await getDb();
  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));

  if (!user) {
    await verifyPassword(parsed.data.password, DUMMY_HASH);
    return { error: GENERIC_ERROR };
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    return { error: "Too many failed attempts. Try again in a few minutes." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    const nextCount = user.failedLoginCount + 1;
    const locking = nextCount >= MAX_FAILED_ATTEMPTS;
    await db
      .update(adminUsers)
      .set({
        failedLoginCount: locking ? 0 : nextCount,
        lockedUntil: locking ? new Date(Date.now() + LOCKOUT_MS) : null,
      })
      .where(eq(adminUsers.id, user.id));
    return { error: locking ? "Too many failed attempts. Try again in a few minutes." : GENERIC_ERROR };
  }

  await db
    .update(adminUsers)
    .set({ failedLoginCount: 0, lockedUntil: null })
    .where(eq(adminUsers.id, user.id));

  const session = await getSession();
  session.adminUserId = user.id;
  session.adminEmail = user.email;
  session.adminRole = user.role;
  await session.save();

  redirect("/admin");
}
