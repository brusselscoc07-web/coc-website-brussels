import { getSession } from "./session";

// proxy.ts already blocks unauthenticated requests to /admin/* (including the
// POSTs that invoke these Server Actions, since they share the page's URL),
// but mutations get their own explicit check too — defense in depth against
// a future refactor that calls one of these from an unprotected path.
export async function requireAdminSession(): Promise<{ adminUserId: string; adminEmail: string; adminRole: string }> {
  const session = await getSession();
  if (!session.adminUserId || !session.adminEmail || !session.adminRole) {
    throw new Error("Not authenticated");
  }
  return { adminUserId: session.adminUserId, adminEmail: session.adminEmail, adminRole: session.adminRole };
}
