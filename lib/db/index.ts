import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Canonical type for the whole app: PGlite's driver has an equivalent but
// distinct TS type, and calling a method across a union of the two collapses
// overload resolution (e.g. `.returning(fields)` starts looking like a
// 0-argument call). Both drivers implement the identical query API we use, so
// the dev-only PGlite branch below is cast to this shared type.
export type AppDatabase = PostgresJsDatabase<typeof schema>;

const dataDir = process.env.PGLITE_DATA_DIR || "./.data/pglite";

// No DATABASE_URL yet (no real Postgres account bound) -> fall back to an
// in-process, file-backed PGlite database so the app runs with zero setup.
// Same schema/queries work unchanged once DATABASE_URL is set later.
export const usingPglite = !process.env.DATABASE_URL;

async function createDb(): Promise<AppDatabase> {
  if (usingPglite) {
    const { mkdir } = await import("node:fs/promises");
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    await mkdir(dataDir, { recursive: true });
    const client = new PGlite(dataDir);
    return drizzle(client, { schema }) as unknown as AppDatabase;
  }

  const { default: postgres } = await import("postgres");
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const client = postgres(process.env.DATABASE_URL!, { max: 10 });
  return drizzle(client, { schema });
}

// Module-level singleton, shared across a request lifecycle and across dev
// server hot-reloads (avoids exhausting connections / re-opening the PGlite file).
declare global {
  // eslint-disable-next-line no-var
  var __dbPromise: Promise<AppDatabase> | undefined;
}

// Deliberately lazy: createDb() must only run when a query actually happens,
// not just because some module imported this file. PGlite's file-locked WASM
// engine crashes ("RuntimeError: Aborted()") if two instances open the same
// `.data/pglite` directory concurrently — which an eager top-level `createDb()`
// call caused during `next build`, since every page/action that merely
// *imports* lib/db (even ones that never call getDb(), like a Server Action
// bundled into a page that's only statically prerendered) would instantiate
// its own PGlite connection in parallel across Next's build workers.
export async function getDb(): Promise<AppDatabase> {
  if (!globalThis.__dbPromise) {
    globalThis.__dbPromise = createDb();
  }
  return globalThis.__dbPromise;
}
