import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { settings } from "./db/schema";

export type LivestreamSetting = { isLive: boolean; toggledBy?: string; toggledAt?: string };

export async function getLivestreamStatus(): Promise<LivestreamSetting> {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, "livestream"));
  return (row?.value as LivestreamSetting) ?? { isLive: false };
}
