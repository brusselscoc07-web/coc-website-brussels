import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Serves local uploads — the dev fallback used when BLOB_READ_WRITE_TOKEN is
// unset (see lib/storage.ts). Once real Blob storage is bound, imageUrl points
// straight at its CDN and this route is never hit in production.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  // Keys are always server-generated (crypto.randomUUID() + extension), never
  // derived from user input, but this route param is directly attacker-reachable
  // regardless — reject anything that isn't exactly that shape before touching the filesystem.
  if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp)$/i.test(key)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = key.split(".").pop()!.toLowerCase();
  const dir = process.env.UPLOADS_DIR || "./uploads";

  try {
    const bytes = await readFile(join(dir, key));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        // Defense in depth on top of the byte-signature check at upload time
        // (lib/storage.ts) — stops a browser from ever sniffing this as
        // something other than the declared image type.
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
