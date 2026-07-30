import { getDb, usingPglite } from "../lib/db";

async function main() {
  const db = await getDb();

  if (usingPglite) {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await migrate(db as any, { migrationsFolder: "./lib/db/migrations" });
  } else {
    const { migrate } = await import("drizzle-orm/postgres-js/migrator");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await migrate(db as any, { migrationsFolder: "./lib/db/migrations" });
  }

  console.log(`Migrations applied (${usingPglite ? "pglite" : "postgres"}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
