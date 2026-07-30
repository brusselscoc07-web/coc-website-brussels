import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth/password";
import { getDb } from "../lib/db";
import { adminUsers } from "../lib/db/schema";

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || "Admin";

  if (!email || !password) {
    console.error("Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD before running this script. Example:");
    console.error("  ADMIN_SEED_EMAIL=admin@cocbrussels.example ADMIN_SEED_PASSWORD='...' npm run db:seed-admin");
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_SEED_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const db = await getDb();
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hashPassword(password);

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, normalizedEmail));

  if (existing) {
    await db
      .update(adminUsers)
      .set({ passwordHash, name, role: "admin", failedLoginCount: 0, lockedUntil: null })
      .where(eq(adminUsers.id, existing.id));
    console.log(`Updated existing admin user: ${normalizedEmail}`);
  } else {
    await db.insert(adminUsers).values({ email: normalizedEmail, passwordHash, name, role: "admin" });
    console.log(`Created admin user: ${normalizedEmail}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
