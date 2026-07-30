import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Set automatically by Vercel; set APP_ENV=production yourself on any other host.
  // Deliberately NOT the same signal as NODE_ENV — `next build`/`next start` set
  // NODE_ENV=production for local production-mode testing too, before any real
  // account has been bound, so that alone can't gate the "must be deployed for real" check below.
  VERCEL: z.string().optional(),
  APP_ENV: z.enum(["development", "production"]).optional(),

  // Database — optional; falls back to a local PGlite file when unset (see lib/db/index.ts)
  DATABASE_URL: z.url().optional(),

  // Email — optional; falls back to console-logging the email when unset (see lib/email.ts)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  CONTACT_NOTIFY_EMAIL: z.email().optional(),

  // File storage — optional; falls back to a local uploads/ dir when unset (see lib/storage.ts)
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Admin session signing — always required, no safe fallback exists for this one
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
});

function loadEnv() {
  // A var present in .env.local but left blank comes through as "" rather than
  // undefined — treat blank the same as unset so the optional-with-fallback fields work.
  const raw = Object.fromEntries(
    Object.entries(process.env).map(([key, value]) => [key, value === "" ? undefined : value]),
  );
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("Invalid environment variables:", z.treeifyError(parsed.error));
    throw new Error(
      "Invalid or missing environment variables — see errors above. Check .env.local against .env.example " +
        "(SESSION_SECRET is required even in local dev — generate one with: openssl rand -base64 32).",
    );
  }

  const isRealDeployment = Boolean(parsed.data.VERCEL) || parsed.data.APP_ENV === "production";
  if (isRealDeployment) {
    const missing = (
      [
        ["DATABASE_URL", parsed.data.DATABASE_URL],
        ["RESEND_API_KEY", parsed.data.RESEND_API_KEY],
        ["BLOB_READ_WRITE_TOKEN", parsed.data.BLOB_READ_WRITE_TOKEN],
        ["CONTACT_NOTIFY_EMAIL", parsed.data.CONTACT_NOTIFY_EMAIL],
      ] as const
    )
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missing.length) {
      throw new Error(
        `Missing required production environment variables: ${missing.join(", ")}. ` +
          "These have local-dev-only fallbacks and must be set for a real deployment.",
      );
    }
  }

  return parsed.data;
}

export const env = loadEnv();
