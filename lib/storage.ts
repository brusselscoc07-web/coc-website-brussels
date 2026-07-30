import { randomUUID } from "node:crypto";

export type UploadResult = { url: string; key: string };

const usingBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

type SniffedImage = { contentType: string; ext: string };

// A client-declared Content-Type / filename extension is fully attacker
// controlled in a crafted multipart request (verified: a PHP/script file
// uploaded with a spoofed `type="image/jpeg"` was accepted and served back
// verbatim before this fix). Only the actual byte signature is trustworthy.
function sniffImageType(bytes: Uint8Array): SniffedImage | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", ext: "jpg" };
  }
  const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= pngSig.length && pngSig.every((byte, i) => bytes[i] === byte)) {
    return { contentType: "image/png", ext: "png" };
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { contentType: "image/webp", ext: "webp" };
  }
  return null;
}

// No BLOB_READ_WRITE_TOKEN yet (no real Blob account bound) -> write to a
// local, gitignored `uploads/` dir served by app/api/uploads/[key]/route.ts.
// Same {url, key} shape either way, so callers never branch on which backend is active.
export async function uploadImage(bytes: Uint8Array): Promise<UploadResult> {
  if (bytes.byteLength === 0) throw new Error("Empty file");
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("File too large");

  const sniffed = sniffImageType(bytes);
  if (!sniffed) throw new Error("Unsupported image type — use JPEG, PNG, or WebP.");

  const key = `${randomUUID()}.${sniffed.ext}`;

  if (usingBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, Buffer.from(bytes), { access: "public", contentType: sniffed.contentType });
    return { url: blob.url, key: blob.pathname };
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const dir = process.env.UPLOADS_DIR || "./uploads";
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, key), bytes);
  return { url: `/api/uploads/${key}`, key };
}

export async function deleteImage(key: string): Promise<void> {
  if (usingBlob) {
    const { del } = await import("@vercel/blob");
    await del(key);
    return;
  }

  const { unlink } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const dir = process.env.UPLOADS_DIR || "./uploads";
  await unlink(join(dir, key)).catch(() => {});
}
